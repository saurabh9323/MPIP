import StackView from "./StackView"
import HeapView from "./HeapView"
import { Step } from "./types"


interface Props {
  step?: Step
}

export default function VisualizationPanel({ step }: Props) {
  if (!step) {
    return (
      <div className="p-6 text-white/60">
        No visualization data
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-xl font-bold">{step.title}</h2>

      <div className="grid grid-cols-2 gap-6 h-full">
        {/* ✅ PASS stack ONLY */}
        <StackView stack={step.stack || []} />

        {/* ✅ PASS heap ONLY */}
        <HeapView heap={step.heap || []} />
      </div>
    </div>
  )
}
