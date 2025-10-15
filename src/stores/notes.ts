import type { Note } from '@/types/api'
import { defineStore } from 'pinia'

// Tạo dữ liệu fake: N ghi chú, thời gian cập nhật lùi dần theo giờ
function makeFakeNotes(n = 60): Note[] {
  const arr: Note[] = []
  const samples = [
    ['Project ideas', 'Capture ideas for Q4…'],
    ['Grocery list', 'Milk, matcha, eggs…'],
    ['Workout log', 'Ankle rehab + sled sprints…'],
    ['Reading notes', 'Summaries from Deep Learning book…'],
    ['Travel plan', 'Phú Quốc – JW Marriott weekend…'],
    ['Meeting recap', 'Decisions, owners, next steps…'],
    ['Random thoughts', 'Tiny habits and systems…'],
  ]
  const now = Date.now()
  for (let i = 0; i < n; i++) {
    const [t, p] = samples[i % samples.length] as [string, string]
    const suffix = i + 1
    arr.push({
      id: now - i, // id khác nhau
      title: `${t} #${suffix}`,
      preview: `${p} (${suffix})`,
      updatedAt: new Date(now - i * 60 * 60 * 1000).toLocaleString(),
    })
  }
  return arr
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: makeFakeNotes(60) as Note[],
    query: '' as string,
  }),
  getters: {
    filteredNotes(state): Note[] {
      const q = state.query.trim().toLowerCase()
      if (!q) return state.notes
      return state.notes.filter((n) => (n.title + ' ' + n.preview).toLowerCase().includes(q))
    },
  },
  actions: {
    setQuery(v: string) {
      this.query = v
    },
    createNote(payload: { title: string; preview?: string }) {
      const { title, preview = '' } = payload
      const now = new Date().toLocaleString()
      this.notes.unshift({
        id: Date.now(),
        title: title.trim(),
        preview: preview.trim(),
        updatedAt: now,
      })
    },
    deleteNote(id: number) {
      this.notes = this.notes.filter((n) => n.id !== id)
    },
  },
})
