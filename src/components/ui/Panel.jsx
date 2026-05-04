function Panel({ title, subtitle, right, children }) {
  return (
    <section className="rounded-xl border border-[#9A8678] bg-[#4B4038] p-4">
      {(title || subtitle || right) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-base font-semibold text-[#f3e8df]">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-[#9A8678]">{subtitle}</p> : null}
          </div>
          {right || null}
        </div>
      )}
      {children}
    </section>
  )
}

export default Panel
