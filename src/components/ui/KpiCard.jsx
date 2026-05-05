function KpiCard({ label, value, hint, trend, icon }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-900/5 ring-1 ring-gray-200/50 backdrop-blur-sm hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {icon}
            </svg>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{hint}</p>
        {trend && (
          <span className={`inline-flex items-center text-sm font-medium ${
            trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend > 0 && (
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )}
            {trend < 0 && (
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </article>
  )
}

export default KpiCard
