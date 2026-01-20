"use client"

import { useState } from "react"
import stepsData from "./comps/mocks/twoSum.steps.json"
import InputPanel from "./comps/InputPanel"
import VisualizationPanel from "./comps/VisualizationPanel"
import ExplanationPanel from "./comps/ExplanationPanel"
import StepController from "./comps/StepController"
import { Step, StepsData } from "./comps/types"

const data = stepsData as StepsData

export default function DsaVisualizers() {
  const [currentStep, setCurrentStep] = useState(0)

  const step: Step = data.steps[currentStep]

  return (
    <div className="grid grid-cols-[300px_1fr_320px] h-screen bg-[#0b0f1a] text-white">
      <InputPanel />

      <VisualizationPanel step={step} />

      <div className="flex flex-col border-l border-white/10">
        <ExplanationPanel
          step={step}
          currentStep={currentStep}
          totalSteps={data.steps.length}
        />

        <StepController
          currentStep={currentStep}
          totalSteps={data.steps.length}
          onPrev={() => setCurrentStep(s => Math.max(s - 1, 0))}
          onNext={() =>
            setCurrentStep(s => Math.min(s + 1, data.steps.length - 1))
          }
        />
      </div>
    </div>
  )
}
