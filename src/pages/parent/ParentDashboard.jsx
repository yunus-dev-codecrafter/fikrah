import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import { fetchAttendanceBySchool } from '../../services/attendanceApi'
import { students } from '../../services/mockData'
import { fetchScoresBySchool } from '../../services/scoresApi'
import { useAuthStore } from '../../store/authStore'
import { isBackendApiEnabled } from '../../services/apiConfig'

function ParentDashboard() {
  const user = useAuthStore((s) => s.user)
  const linkedChildren = students.filter((x) => x.schoolId === user?.schoolId)
  const [avgScore, setAvgScore] = useState('74%')
  const [attendanceRate, setAttendanceRate] = useState('95%')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadKpis() {
      if (!user?.schoolId || !isBackendApiEnabled()) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const [scoresRes, attendanceRes] = await Promise.all([
          fetchScoresBySchool(user.schoolId),
          fetchAttendanceBySchool(user.schoolId),
        ])

        if (cancelled) return

        const scores = scoresRes.records || []
        if (scores.length > 0) {
          const total = scores.reduce((sum, item) => sum + Number(item.totalScore || 0), 0)
          const avg = Math.round(total / scores.length)
          setAvgScore(`${avg}%`)
        } else {
          setAvgScore('N/A')
        }

        const attendance = attendanceRes.records || []
        const totals = attendance.reduce(
          (acc, item) => {
            acc.present += Number(item.presentCount || 0)
            acc.absent += Number(item.absentCount || 0)
            return acc
          },
          { present: 0, absent: 0 },
        )
        const combined = totals.present + totals.absent
        if (combined > 0) {
          const rate = Math.round((totals.present / combined) * 100)
          setAttendanceRate(`${rate}%`)
        } else {
          setAttendanceRate('N/A')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Could not load live KPIs.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadKpis()
    return () => {
      cancelled = true
    }
  }, [user?.schoolId])

  const scoreHint = useMemo(
    () => (loading ? 'Loading from backend' : 'Current term'),
    [loading],
  )
  const attendanceHint = useMemo(
    () => (loading ? 'Loading from backend' : 'Combined child attendance'),
    [loading],
  )

  return (
    <DashboardLayout title="Parent Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Children Linked" value={linkedChildren.length} hint="Parent account mapping" />
        <KpiCard label="Average Score" value={avgScore} hint={scoreHint} />
        <KpiCard label="Attendance" value={attendanceRate} hint={attendanceHint} />
        <KpiCard label="Payment Status" value="Pending" hint="Manual tracking enabled" />
      </section>
      <Panel title="Child Overview" subtitle="Academic and attendance quick visibility">
        {error ? <p className="mb-3 text-sm text-amber-300">{error}</p> : null}
        <ul className="space-y-2 text-sm">
          {linkedChildren.map((child) => (
            <li key={child.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3">
              <p className="font-semibold text-[#f3e8df]">{child.name}</p>
              <p className="text-[#c9b7ab]">{child.className}</p>
              <p className="text-xs text-[#9A8678]">schoolId: {child.schoolId}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default ParentDashboard
