function DataTable({ columns, rows, emptyText = 'No records found.' }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-900/5 ring-1 ring-gray-200/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center" colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
