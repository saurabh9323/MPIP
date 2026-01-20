interface Props {
  currentStep: number
  totalSteps: number
  onPrev: () => void
  onNext: () => void
}

export default function StepController({
  currentStep,
  totalSteps,
  onPrev,
  onNext
}: Props) {
  return (
    <div className="p-4 border-t border-white/10 flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="px-3 py-1 bg-white/10 rounded disabled:opacity-30"
      >
        ◀ Prev
      </button>

      <span className="text-sm">
        {currentStep + 1} / {totalSteps}
      </span>

      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="px-3 py-1 bg-white/10 rounded disabled:opacity-30"
      >
        Next ▶
      </button>
    </div>
  )
}
