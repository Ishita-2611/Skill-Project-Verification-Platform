export default function SuccessMessage({ message }) {
  if (!message) return null
  
  return (
    <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-green-600 font-bold">✓</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">{message}</p>
        </div>
      </div>
    </div>
  )
}
