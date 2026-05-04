import { create } from 'zustand'
import { getLetterGrade } from '../utils/grading'

export const useAcademicStore = create((set) => ({
  scoreRecords: [],
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
  updateHeadmasterReview: ({ id, status, headmasterComment }) =>
    set((state) => ({
      scoreRecords: state.scoreRecords.map((record) =>
        record.id === id
          ? { ...record, headmasterStatus: status, headmasterComment, updatedAt: new Date().toISOString() }
          : record,
      ),
    })),
}))
