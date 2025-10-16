import type { Note } from '@/types/api'
import { defineStore } from 'pinia'

// Tạo dữ liệu fake: N ghi chú, thời gian cập nhật lùi dần theo giờ
function makeFakeNotes(n = 60): Note[] {
  const arr: Note[] = []
  const samples = [
    [
      'Reactive',
      'Hệ thống reactivity: Khi state thay đổi, Vue tự cập nhật DOM tương ứng. Dựa trên dependency tracking. Thường sử dụng ref(), reactive(), computed(), watch() để làm việc với dữ liệu reactive.',
    ],
    [
      'Components',
      'Tái sử dụng UI, Single File Components gồm template, script, style. Script có thể viết theo các kiểu API khác nhau',
    ],
    [
      'Các API để viết component: Options API, Composition API, Script setup',
      'Options API: cách truyền thống của Vue 2 — define data, methods, computed, watch, mounted, props, v.v. trong đối tượng options. Composition API: sử dụng setup() để tạo reactive state, methods, composables. Script setup: cú pháp đơn giản hơn, không cần export default, tự động nhận props, v.v.',
    ],
    ['Template', 'Chủ yếu dùng template syntax, ngoài ra có render() function hoặc JSX.'],
    [
      'Directive',
      'cung cấp các directive để làm việc với DOM trong template: v-bind (viết tắt :) — ràng buộc thuộc tính, ví dụ :src="imageUrl", v-on (viết tắt @) — lắng nghe sự kiện, ví dụ @click="doSomething", v-if, v-else-if, v-else — điều kiện hiển thị, ...',
    ],
    [
      'Props, Emits, Slots',
      'Props: cách truyền dữ liệu từ component cha xuống con (one-way). Emits: cách con gửi sự kiện lên cha. Slots: cách truyền nội dung từ cha vào con để tùy biến giao diện.',
    ],
    ['Lifecycle Hooks', 'các hàm gọi trong vòng đời component: mounted, unmounted, updated, v.v.'],
    [
      'Computed & Watchers',
      'Computed là giá trị tính toán dựa vào reactive state, được cache cho đến khi state phụ thuộc thay đổi. Watchers theo dõi sự thay đổi của reactive state để thực thi hàm.',
    ],
    ['Router', 'vue-router'],
    ['State Management', 'Pinia'],
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
