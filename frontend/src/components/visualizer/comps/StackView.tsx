import { StackFrame } from "./types"

interface Props {
  stack: StackFrame[]
}

export default function StackView({ stack }: Props) {
  return (
    <div className="bg-black/20 rounded p-4">
      <h4 className="font-semibold mb-2">Stack</h4>

      {stack.length === 0 && (
        <p className="text-sm text-white/50">Stack empty</p>
      )}

      {stack.map(frame => (
        <div
          key={frame.address}
          className="bg-blue-500/20 border border-blue-500/40 p-2 rounded mb-2"
        >
          <div>{frame.name}</div>
          <small className="text-white/60">{frame.address}</small>
        </div>
      ))}
    </div>
  )
}
