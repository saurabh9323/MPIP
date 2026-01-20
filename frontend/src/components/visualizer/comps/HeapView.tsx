import { HeapObject } from "./types"

interface Props {
  heap: HeapObject[]
}

export default function HeapView({ heap }: Props) {
  return (
    <div className="bg-black/20 rounded p-4">
      <h4 className="font-semibold mb-2">Heap</h4>

      {heap.length === 0 && (
        <p className="text-sm text-white/50">Heap empty</p>
      )}

      {heap.map(obj => (
        <div
          key={obj.address}
          className="bg-green-500/20 border border-green-500/40 p-2 rounded mb-2"
        >
          <div className="font-semibold">{obj.type}</div>
          <small className="text-white/60">{obj.address}</small>
          <pre className="text-xs mt-2">
            {JSON.stringify(obj.data, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  )
}
