import { Step } from "./types"

interface Props {
  step: Step
  currentStep: number
  totalSteps: number
}

export default function ExplanationPanel({
  step,
  currentStep,
  totalSteps
}: Props) {
  return (
    <div className="p-4 flex-1 overflow-auto">
      <h3 className="text-lg font-semibold mb-2">
        Step {currentStep + 1} / {totalSteps}
      </h3>

      <p className="text-sm mb-4">{step.description}</p>

      {step.variables && (
        <>
          <h4 className="font-semibold mb-1">Variables</h4>
          <ul className="text-sm">
            {Object.entries(step.variables).map(([key, value]) => (
              <li key={key}>
                {key}: <strong>{String(value)}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
