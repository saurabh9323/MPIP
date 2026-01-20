export default function InputPanel() {
  return (
    <div className="p-4 border-r border-white/10 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Problem Statement</h3>
      <textarea
        className="bg-black/30 p-2 rounded text-sm"
        placeholder="Paste problem here..."
        rows={6}
      />

      <h3 className="text-lg font-semibold">Solution Code (JS)</h3>
      <textarea
        className="bg-black/30 p-2 rounded text-sm"
        rows={10}
        readOnly
        value={`function twoSum(nums, target) {
  const map = {}
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i]
    if (map[diff] !== undefined) {
      return [map[diff], i]
    }
    map[nums[i]] = i
  }
}`}
      />

      <button className="mt-auto bg-blue-600 hover:bg-blue-500 py-2 rounded">
        Visualize Runtime
      </button>
    </div>
  )
}
