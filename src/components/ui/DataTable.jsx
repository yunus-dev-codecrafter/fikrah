function DataTable({ columns, rows, emptyText = 'No records found.' }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#9A8678]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#202940] text-[#c9b7ab]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-[#9A8678] bg-[#4B4038] text-[#9A8678]">
                <td className="px-3 py-3" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={row.id || idx} className="border-t border-[#9A8678] bg-[#4B4038] text-[#f3e8df]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2">
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
