import {
    Input, Label, Typography,
} from "@equinor/eds-core-react"
import { useEffect, useState } from "react"
import {
    useParams,
} from "react-router"
import styled from "styled-components"
import Save from "../Components/Save"
import AssetName from "../Components/AssetName"
import TimeSeries from "../Components/TimeSeries"
import { WellProject } from "../models/assets/wellproject/WellProject"
import { Case } from "../models/Case"
import { Project } from "../models/Project"
import { GetProjectService } from "../Services/ProjectService"
import { GetWellProjectService } from "../Services/WellProjectService"
import { unwrapCase, unwrapProjectId } from "../Utils/common"
import { GetArtificialLiftName, initializeFirstAndLastYear } from "./Asset/AssetHelper"
import {
    AssetViewDiv, Dg4Field, Wrapper, WrapperColumn,
} from "./Asset/StyledAssetComponents"
import AssetTypeEnum from "../models/assets/AssetTypeEnum"
import NumberInput from "../Components/NumberInput"
import { DrillingSchedule } from "../models/assets/wellproject/DrillingSchedule"
import { WellProjectCostProfile } from "../models/assets/wellproject/WellProjectCostProfile"
import AssetCurrency from "../Components/AssetCurrency"
import SideMenu from "../Components/SideMenu/SideMenu"
import { IAssetService } from "../Services/IAssetService"
import ArtificialLiftInherited from "../Components/ArtificialLiftInherited"

const ProjectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
`
const Body = styled.div`
    display: flex;
    flex-direction: row;
    flex-row: 1;
    width: 100%;
    height: 100%;
`
const MainView = styled.div`
    width: calc(100% - 15rem);
    overflow: scroll;
`

function WellProjectView() {
    const [project, setProject] = useState<Project>()
    const [caseItem, setCase] = useState<Case>()
    const [wellProject, setWellProject] = useState<WellProject>()
    const [hasChanges, setHasChanges] = useState(false)
    const [wellProjectName, setWellProjectName] = useState<string>("")
    const { fusionProjectId, caseId, wellProjectId } = useParams<Record<string, string | undefined>>()
    const [firstTSYear, setFirstTSYear] = useState<number>()
    const [lastTSYear, setLastTSYear] = useState<number>()
    const [annualWellInterventionCost, setAnnualWellInterventionCost] = useState<number>()
    const [pluggingAndAbandonment, setPluggingAndAbandonment] = useState<number>()
    const [rigMobDemob, setRigMobDemob] = useState<number>()
    const [costProfile, setCostProfile] = useState<WellProjectCostProfile>()
    const [drillingSchedule, setDrillingSchedule] = useState<DrillingSchedule>()
    const [currency, setCurrency] = useState<Components.Schemas.Currency>(1)
    const [wellProjectService, setWellProjectService] = useState<IAssetService>()
    const [artificialLift, setArtificialLift] = useState<Components.Schemas.ArtificialLift | undefined>()

    useEffect(() => {
        (async () => {
            try {
                const projectId: string = unwrapProjectId(fusionProjectId)
                const projectResult: Project = await (await GetProjectService()).getProjectByID(projectId)
                setProject(projectResult)
                const service = await GetWellProjectService()
                setWellProjectService(service)
            } catch (error) {
                console.error(`[CaseView] Error while fetching project ${fusionProjectId}`, error)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (project !== undefined) {
                const caseResult: Case = unwrapCase(project.cases.find((o) => o.id === caseId))
                setCase(caseResult)
                // eslint-disable-next-line max-len
                let newWellProject: WellProject | undefined = project?.wellProjects.find((s) => s.id === wellProjectId)
                if (newWellProject !== undefined) {
                    setWellProject(newWellProject)
                } else {
                    newWellProject = new WellProject()
                    newWellProject.artificialLift = caseResult?.artificialLift
                    newWellProject.currency = project.currency
                    setWellProject(newWellProject)
                }
                setWellProjectName(newWellProject?.name!)

                setAnnualWellInterventionCost(newWellProject.annualWellInterventionCost)
                setPluggingAndAbandonment(newWellProject.pluggingAndAbandonment)
                setRigMobDemob(newWellProject.rigMobDemob)
                setCurrency(newWellProject.currency ?? 1)

                setCostProfile(newWellProject.costProfile)
                setDrillingSchedule(newWellProject.drillingSchedule)
                setArtificialLift(newWellProject.artificialLift)

                if (caseResult?.DG4Date) {
                    initializeFirstAndLastYear(
                        caseResult?.DG4Date?.getFullYear(),
                        [newWellProject.costProfile, newWellProject.drillingSchedule],
                        setFirstTSYear,
                        setLastTSYear,
                    )
                }
            }
        })()
    }, [project])

    useEffect(() => {
        const newWellProject: WellProject = { ...wellProject }
        newWellProject.annualWellInterventionCost = annualWellInterventionCost
        newWellProject.pluggingAndAbandonment = pluggingAndAbandonment
        newWellProject.rigMobDemob = rigMobDemob
        newWellProject.costProfile = costProfile
        newWellProject.drillingSchedule = drillingSchedule
        newWellProject.currency = currency
        newWellProject.artificialLift = artificialLift
        if (caseItem?.DG4Date) {
            initializeFirstAndLastYear(
                caseItem?.DG4Date?.getFullYear(),
                [costProfile, drillingSchedule],
                setFirstTSYear,
                setLastTSYear,
            )
        }
        setWellProject(newWellProject)
    }, [annualWellInterventionCost, pluggingAndAbandonment, rigMobDemob, costProfile, drillingSchedule, currency,
         artificialLift])

    return (
        <ProjectWrapper>
            <Body>
                <SideMenu />
                <MainView>
                    <AssetViewDiv>
                        <Wrapper>
                            <Typography variant="h2">WellProject</Typography>
                            <Save
                                name={wellProjectName}
                                setHasChanges={setHasChanges}
                                hasChanges={hasChanges}
                                setAsset={setWellProject}
                                setProject={setProject}
                                asset={wellProject!}
                                assetService={wellProjectService!}
                                assetType={AssetTypeEnum.wellProjects}
                            />
                        </Wrapper>
                        <AssetName
                            setName={setWellProjectName}
                            name={wellProjectName}
                            setHasChanges={setHasChanges}
                        />
                        <Wrapper>
                            <Typography variant="h4">DG3</Typography>
                            <Dg4Field>
                                <Input
                                    disabled
                                    defaultValue={caseItem?.DG3Date?.toLocaleDateString("en-CA")}
                                    type="date"
                                />
                            </Dg4Field>
                            <Typography variant="h4">DG4</Typography>
                            <Dg4Field>
                                <Input
                                    disabled
                                    defaultValue={caseItem?.DG4Date?.toLocaleDateString("en-CA")}
                                    type="date"
                                />
                            </Dg4Field>
                        </Wrapper>
                        <AssetCurrency
                            setCurrency={setCurrency}
                            setHasChanges={setHasChanges}
                            currentValue={currency}
                        />
                        <Wrapper>
                            <WrapperColumn>
                                <Label htmlFor="name" label="Artificial lift" />
                                <Input
                                    id="artificialLift"
                                    disabled
                                    defaultValue={GetArtificialLiftName(wellProject?.artificialLift)}
                                />
                            </WrapperColumn>
                        </Wrapper>
                        <Wrapper>
                            <NumberInput
                                setValue={setRigMobDemob}
                                value={rigMobDemob ?? 0}
                                setHasChanges={setHasChanges}
                                integer={false}
                                label="Rig mob demob"
                            />
                            <NumberInput
                                setValue={setAnnualWellInterventionCost}
                                value={annualWellInterventionCost ?? 0}
                                setHasChanges={setHasChanges}
                                integer={false}
                                label="Annual well intervention cost"
                            />
                            <NumberInput
                                setValue={setPluggingAndAbandonment}
                                value={pluggingAndAbandonment ?? 0}
                                setHasChanges={setHasChanges}
                                integer={false}
                                label="Plugging and abandonment"
                            />
                        </Wrapper>
                        <TimeSeries
                            dG4Year={caseItem?.DG4Date?.getFullYear()}
                            setTimeSeries={setCostProfile}
                            setHasChanges={setHasChanges}
                            timeSeries={costProfile}
                            timeSeriesTitle={`Cost profile ${currency === 2 ? "(MUSD)" : "(MNOK)"}`}
                            firstYear={firstTSYear!}
                            lastYear={lastTSYear!}
                            setFirstYear={setFirstTSYear!}
                            setLastYear={setLastTSYear}
                        />
                        <TimeSeries
                            dG4Year={caseItem?.DG4Date?.getFullYear()}
                            setTimeSeries={setDrillingSchedule}
                            setHasChanges={setHasChanges}
                            timeSeries={drillingSchedule}
                            timeSeriesTitle="Drilling schedule"
                            firstYear={firstTSYear!}
                            lastYear={lastTSYear!}
                            setFirstYear={setFirstTSYear!}
                            setLastYear={setLastTSYear}
                        />
                    </AssetViewDiv>
                </MainView>
            </Body>
        </ProjectWrapper>
    )
}

export default WellProjectView
