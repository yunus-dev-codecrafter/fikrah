function Panel({ title, subtitle, right, children, className = '' }) {
  return (
    <section className={`rounded-2xl bg-white p-6 shadow-lg shadow-gray-900/5 ring-1 ring-gray-200/50 backdrop-blur-sm hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300 ${className}`}>
      {(title || subtitle || right) && (
        <div className="mb-6 flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex-1">
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {right && (
            <div className="flex-shrink-0">
              {right}
            </div>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </section>
  )
}

export default Panel
