const statusStyles = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200'
}

function StatusBadge({ status = 'pending', className = '' }) {
  const normalized = status.toLowerCase()
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 ${statusStyles[normalized] || statusStyles.pending} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-60"></span>
      {status}
    </span>
  )
}

export default StatusBadge
