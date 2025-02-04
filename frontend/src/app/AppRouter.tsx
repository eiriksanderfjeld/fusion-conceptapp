import { useEffect } from "react"
import { Route, Switch, useHistory } from "react-router-dom"
import CaseView from "../Views/CaseView"
import DrainageStrategyView from "../Views/DrainageStrategyView"
import ExplorationView from "../Views/ExplorationView"
import ProjectView from "../Views/ProjectView"
import SubstructureView from "../Views/SubstructureView"
import SurfView from "../Views/SurfView"
import TopsideView from "../Views/TopsideView"
import TransportView from "../Views/TransportView"
import Welcome from "../Views/Welcome"
import WellProjectView from "../Views/WellProjectView"

export function AppRouter(): JSX.Element {
    const history = useHistory()
    useEffect(() => {
        console.log("useEffect in AppRouter")
        // history.push("123")
    }, [])
    return (
        <Switch>
            <Route exact path="/">
                <Welcome />
            </Route>
            <Route exact path="/:fusionProjectId">
                <ProjectView />
            </Route>
            <Route path="/:fusionProjectId/case/:caseId" exact>
                <CaseView />
            </Route>
            <Route path="/:fusionProjectId/case/:caseId/surf/:surfId" exact>
                <SurfView />
            </Route>
            <Route
                path="/:fusionProjectId/case/:caseId/drainagestrategy/:drainageStrategyId"
                exact
            >
                <DrainageStrategyView />
            </Route>
            <Route
                path="/:fusionProjectId/case/:caseId/topside/:topsideId"
                exact
            >
                <TopsideView />
            </Route>
            <Route
                path="/:fusionProjectId/case/:caseId/substructure/:substructureId"
                exact
            >
                <SubstructureView />
            </Route>
            <Route
                path="/:fusionProjectId/case/:caseId/transport/:transportId"
                exact
            >
                <TransportView />
            </Route>
            <Route
                path="/:fusionProjectId/case/:caseId/wellproject/:wellProjectId"
                exact
            >
                <WellProjectView />
            </Route>
            <Route
                path="/:fusionProjectId/case/:caseId/exploration/:explorationId"
                exact
            >
                <ExplorationView />
            </Route>
        </Switch>
    )
}
