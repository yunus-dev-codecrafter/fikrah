function KpiCard({ label, value, hint }) {
  return (
    <article className="rounded-xl border border-[#9A8678] bg-[#4B4038] p-4">
      <p className="text-sm text-[#9A8678]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#f3e8df]">{value}</p>
      <p className="mt-1 text-xs text-[#9A8678]">{hint}</p>
    </article>
  )
}

export default KpiCard
