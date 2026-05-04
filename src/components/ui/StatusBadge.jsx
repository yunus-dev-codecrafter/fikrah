const statusStyles = {
  active: 'bg-[#CAAA98]/20 text-[#f4d2bf] border-[#CAAA98]',
  pending: 'bg-[#9A8678]/20 text-[#c9b7ab] border-[#9A8678]',
  inactive: 'bg-[#202940]/70 text-[#9A8678] border-[#9A8678]',
  approved: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  rejected: 'bg-rose-900/40 text-rose-300 border-rose-700',
}

function StatusBadge({ status = 'pending' }) {
  const normalized = status.toLowerCase()
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[normalized] || statusStyles.pending}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
