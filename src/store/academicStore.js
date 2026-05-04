import { create } from 'zustand'
import { getLetterGrade } from '../utils/grading'
import { isBackendApiEnabled } from '../services/apiConfig'
import { createScoreRecord, fetchScoresBySchool, reviewScoreRecord } from '../services/scoresApi'

export const useAcademicStore = create((set) => ({
  scoreRecords: [],
  loadingScores: false,
  scoresError: '',

  fetchScoreRecords: async (schoolId) => {
    if (!schoolId) return

    if (!isBackendApiEnabled()) {
      set({ scoresError: '' })
      return
    }

    set({ loadingScores: true, scoresError: '' })
    try {
      const data = await fetchScoresBySchool(schoolId)
      set({ scoreRecords: data.records || [], loadingScores: false, scoresError: '' })
    } catch (err) {
      set({
        loadingScores: false,
        scoresError: err?.message || 'Could not load scores.',
      })
    }
  },

  addScoreRecord: (payload) =>
    set((state) => {
      const totalScore = Number(payload.caScore) + Number(payload.examScore)
      const newRecord = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        schoolId: payload.schoolId,
        studentName: payload.studentName,
        subject: payload.subject,
        caScore: Number(payload.caScore),
        examScore: Number(payload.examScore),
        totalScore,
        grade: getLetterGrade(totalScore),
        teacherComment: payload.teacherComment || '',
        headmasterStatus: 'pending',
        headmasterComment: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return { scoreRecords: [newRecord, ...state.scoreRecords] }
    }),

  saveScoreRecord: async (payload) => {
    if (!isBackendApiEnabled()) {
      set((state) => {
        const totalScore = Number(payload.caScore) + Number(payload.examScore)
        const newRecord = {
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          schoolId: payload.schoolId,
          studentName: payload.studentName,
          subject: payload.subject,
          caScore: Number(payload.caScore),
          examScore: Number(payload.examScore),
          totalScore,
          grade: getLetterGrade(totalScore),
          teacherComment: payload.teacherComment || '',
          headmasterStatus: 'pending',
          headmasterComment: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return { scoreRecords: [newRecord, ...state.scoreRecords], scoresError: '' }
      })
      return { ok: true }
    }

    try {
      const data = await createScoreRecord(payload)
      set((state) => ({
        scoreRecords: [data.record, ...state.scoreRecords],
        scoresError: '',
      }))
      return { ok: true, record: data.record }
    } catch (err) {
      const message = err?.message || 'Could not save score.'
      set({ scoresError: message })
      return { ok: false, message }
    }
  },

  updateHeadmasterReview: ({ id, status, headmasterComment }) =>
    set((state) => ({
      scoreRecords: state.scoreRecords.map((record) =>
        record.id === id
          ? { ...record, headmasterStatus: status, headmasterComment, updatedAt: new Date().toISOString() }
          : record,
      ),
    })),

  submitHeadmasterReview: async ({ id, status, headmasterComment }) => {
    if (!isBackendApiEnabled()) {
      set((state) => ({
        scoreRecords: state.scoreRecords.map((record) =>
          record.id === id
            ? { ...record, headmasterStatus: status, headmasterComment, updatedAt: new Date().toISOString() }
            : record,
        ),
        scoresError: '',
      }))
      return { ok: true }
    }

    try {
      const data = await reviewScoreRecord(id, { status, headmasterComment })
      set((state) => ({
        scoreRecords: state.scoreRecords.map((record) =>
          record.id === id ? data.record : record,
        ),
        scoresError: '',
      }))
      return { ok: true, record: data.record }
    } catch (err) {
      const message = err?.message || 'Could not submit headmaster review.'
      set({ scoresError: message })
      return { ok: false, message }
    }
  },
}))
