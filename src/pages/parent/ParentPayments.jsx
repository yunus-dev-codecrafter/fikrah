import DashboardLayout from '../../components/layout/DashboardLayout'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'

const paymentRows = [
  { id: 'PY-1', schoolId: 'SCH-001', term: 'First Term', amount: '₦45,000', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'PY-2', schoolId: 'SCH-001', term: 'Second Term', amount: '₦45,000', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'PY-3', schoolId: 'SCH-001', term: 'Third Term', amount: '₦45,000', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

function ParentPayments() {
  return (
    <DashboardLayout title="Parent Payment Status">
      <Panel title="Manual Payment Tracking" subtitle="Backend-powered payment history comes in Stage 2.">
        <p className="mt-1 text-sm text-[#9A8678]">
          Stage 1 mock records. Backend-powered payment history comes in Stage 2.
        </p>
      </Panel>

      <Panel title="Fee Status">
        <ul className="space-y-2">
          {paymentRows.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3 text-sm"
            >
              <div>
                <p className="font-semibold text-[#f3e8df]">{item.term}</p>
                <p className="text-[#c9b7ab]">{item.amount}</p>
                <p className="text-xs text-[#9A8678]">schoolId: {item.schoolId}</p>
              </div>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default ParentPayments
