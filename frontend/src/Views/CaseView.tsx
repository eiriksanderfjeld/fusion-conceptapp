import {
    Switch,
    Tabs,
} from "@equinor/eds-core-react"
import {
    MouseEventHandler,
    useEffect,
    useState,
} from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { Project } from "../models/Project"
import { Case } from "../models/Case"
import { GetProjectService } from "../Services/ProjectService"
import CaseAsset from "../Components/CaseAsset"
import CaseDescription from "../Components/CaseDescription"
import CaseName from "../Components/CaseName"
import { unwrapCase, unwrapProjectId } from "../Utils/common"
import CaseDGDate from "../Components/CaseDGDate"
import CaseArtificialLift from "../Components/CaseArtificialLift"
import DGEnum from "../models/DGEnum"
import ProductionStrategyOverview from "../Components/ProductionStrategyOverview"
import NumberInput from "../Components/NumberInput"
import { GetCaseService } from "../Services/CaseService"
import SideMenu from "../Components/SideMenu/SideMenu"
import ExcelUpload from "../Components/ExcelUpload"
// import ExcelUpload from "../Components/ExcelUpload"

const CaseViewDiv = styled.div`
    margin: 2rem;
    display: flex;
    flex-direction: column;
`

const Wrapper = styled.div`
    display: flex;
    > *:not(:last-child) {
        margin-right: 1rem;
    }
    flex-direction: row;
`
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

const DividerLine = styled.div`
    background: gray;
    height: 0.05rem;
    width: 50rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
`

function CaseView() {
    const [project, setProject] = useState<Project>()
    const [caseItem, setCase] = useState<Case>()
    const [activeTab, setActiveTab] = useState<number>(0)
    const { fusionProjectId, caseId } = useParams<Record<string, string | undefined>>()
    const [artificialLift, setArtificialLift] = useState<Components.Schemas.ArtificialLift>(0)
    const [prodStratOverview, setProdStratOverview] = useState<Components.Schemas.ProductionStrategyOverview>(0)
    const [producerCount, setProducerCount] = useState<number>()
    const [gasInjectorCount, setGasInjectorCount] = useState<number>()
    const [waterInjectorCount, setWaterInjectorCount] = useState<number>()
    const [facilitiesAvailability, setFacilitiesAvailability] = useState<number>()
    const [isReferenceCase, setIsReferenceCase] = useState<boolean | undefined>()

    useEffect(() => {
        (async () => {
            try {
                const projectId: string = unwrapProjectId(fusionProjectId)
                const projectResult: Project = await (await GetProjectService()).getProjectByID(projectId)
                setProject(projectResult)
                const caseResult = projectResult.cases.find((o) => o.id === caseId)
                setCase(caseResult)
            } catch (error) {
                console.error(`[CaseView] Error while fetching project ${fusionProjectId}`, error)
            }
        })()
    }, [fusionProjectId, caseId])

    useEffect(() => {
        if (project !== undefined) {
            const caseResult: Case | undefined = project.cases.find((o) => o.id === caseId)
            if (caseResult !== undefined) {
                setArtificialLift(caseResult.artificialLift)
                setProdStratOverview(caseResult.productionStrategyOverview)
                setFacilitiesAvailability(caseResult?.facilitiesAvailability)
                setIsReferenceCase(caseResult?.referenceCase ?? false)
            }
            setCase(caseResult)
            setProducerCount(caseResult?.producerCount)
            setGasInjectorCount(caseResult?.gasInjectorCount)
            setWaterInjectorCount(caseResult?.waterInjectorCount)
            setFacilitiesAvailability(caseResult?.facilitiesAvailability)
        }
    }, [project])

    useEffect(() => {
        (async () => {
            if (caseItem) {
                const caseDto = Case.Copy(caseItem)
                caseDto.producerCount = producerCount
                caseDto.gasInjectorCount = gasInjectorCount
                caseDto.waterInjectorCount = waterInjectorCount
                caseDto.facilitiesAvailability = facilitiesAvailability
                caseDto.referenceCase = isReferenceCase ?? false

                const newProject = await (await GetCaseService()).updateCase(caseDto)
                setCase(newProject.cases.find((o) => o.id === caseItem.id))
            }
        })()
    }, [producerCount, gasInjectorCount, waterInjectorCount, facilitiesAvailability, isReferenceCase])

    const handleTabChange = (index: number) => {
        setActiveTab(index)
    }

    const switchReferance: MouseEventHandler<HTMLInputElement> = () => {
        if (!isReferenceCase || isReferenceCase === undefined) {
            setIsReferenceCase(true)
        } else setIsReferenceCase(false)
    }

    if (!project) return null

    return (

        <CaseViewDiv>
            <CaseName
                caseItem={caseItem}
                setProject={setProject}
                setCase={setCase}
            />
            <ExcelUpload setProject={setProject} setCase={setCase} />
            <Tabs activeTab={activeTab} onChange={handleTabChange}>
                <CaseDescription
                    caseItem={caseItem}
                    setProject={setProject}
                    setCase={setCase}
                />
                <Switch onClick={switchReferance} label="Reference case" readOnly checked={isReferenceCase ?? false} />
                <Wrapper>
                    <CaseDGDate
                        caseItem={caseItem}
                        setProject={setProject}
                        setCase={setCase}
                        dGType={DGEnum.DG0}
                        dGName="DG0"
                    />
                </Wrapper>
                <Wrapper>
                    <CaseDGDate
                        caseItem={caseItem}
                        setProject={setProject}
                        setCase={setCase}
                        dGType={DGEnum.DG1}
                        dGName="DG1"
                    />
                    <CaseDGDate
                        caseItem={caseItem}
                        setProject={setProject}
                        setCase={setCase}
                        dGType={DGEnum.DG3}
                        dGName="DG3"
                    />
                </Wrapper>
                <Wrapper style={{ marginBottom: -35 }}>
                    <CaseDGDate
                        caseItem={caseItem}
                        setProject={setProject}
                        setCase={setCase}
                        dGType={DGEnum.DG2}
                        dGName="DG2"
                    />
                    <CaseDGDate
                        caseItem={caseItem}
                        setProject={setProject}
                        setCase={setCase}
                        dGType={DGEnum.DG4}
                        dGName="DG4"
                    />
                </Wrapper>
                <DividerLine />
                <Wrapper style={{ marginBottom: -15 }}>
                    <CaseArtificialLift
                        currentValue={artificialLift}
                        setArtificialLift={setArtificialLift}
                        setProject={setProject}
                        caseItem={caseItem}
                    />
                    <ProductionStrategyOverview
                        currentValue={prodStratOverview}
                        setProductionStrategyOverview={setProdStratOverview}
                        setProject={setProject}
                        caseItem={caseItem}
                    />
                </Wrapper>
                <DividerLine />
                <Wrapper style={{ marginBottom: 45 }}>
                    <NumberInput
                        setValue={setProducerCount}
                        value={producerCount ?? 0}
                        integer
                        disabled={false}
                        label="Producer count"
                    />
                    <NumberInput
                        setValue={setGasInjectorCount}
                        value={gasInjectorCount ?? 0}
                        integer
                        disabled={false}
                        label="Gas injector count"
                    />
                    <NumberInput
                        setValue={setWaterInjectorCount}
                        value={waterInjectorCount ?? 0}
                        integer
                        disabled={false}
                        label="Water injector count"
                    />
                    <NumberInput
                        setValue={setFacilitiesAvailability}
                        value={facilitiesAvailability ?? 0}
                        integer
                        disabled={false}
                        label={`Facilities availability ${project?.physUnit === 0 ? "(%)" : "(Oilfield)"}`}
                    />
                </Wrapper>
                <DividerLine />
                <CaseAsset
                    caseItem={caseItem}
                    project={project}
                    setProject={setProject}
                    setCase={setCase}
                    caseId={caseId}
                />
            </Tabs>
        </CaseViewDiv>
    )
}

export default CaseView
