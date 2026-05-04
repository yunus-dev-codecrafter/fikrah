import DashboardLayout from '../../components/layout/DashboardLayout'

const paymentRows = [
  { term: 'First Term', amount: '₦45,000', status: 'Paid' },
  { term: 'Second Term', amount: '₦45,000', status: 'Pending' },
  { term: 'Third Term', amount: '₦45,000', status: 'Pending' },
]

function ParentPayments() {
  return (
    <DashboardLayout title="Parent Payment Status">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Manual Payment Tracking</h2>
        <p className="mt-1 text-sm text-slate-600">
          Stage 1 mock records. Backend-powered payment history comes in Stage 2.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <ul className="space-y-2">
          {paymentRows.map((item) => (
            <li
              key={item.term}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.term}</p>
                <p className="text-slate-600">{item.amount}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  item.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  )
}

export default ParentPayments
