<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import Separator from '@/components/ui/separator/Separator.vue'

import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'

import { useNotesStore } from '@/stores/notes'
import { apiPost } from '@/lib/api'
import type { Note, SummaryResponse } from '@/types/api'

const notesStore = useNotesStore()
const { query, filteredNotes } = storeToRefs(notesStore)

// Pagination
const page = ref(1)
const pageSize = ref(9)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredNotes.value.length / pageSize.value)),
)
const pagedNotes = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredNotes.value.slice(start, start + pageSize.value)
})
watch([query, pageSize], () => (page.value = 1))

function gotoPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
}
function prev() {
  gotoPage(page.value - 1)
}
function next() {
  gotoPage(page.value + 1)
}

// Dialog states
const openNote = ref<Note | null>(null)
const editNote = ref<Note | null>(null)
const deleteNote = ref<Note | null>(null)

// Form fields for edit
const editTitle = ref('')
const editPreview = ref('')

// AI Summary
const aiDialogOpen = ref(false)
const aiSummary = ref('')

async function fetchSummaryFromBackend() {
  aiSummary.value = 'Summarizing notes...'

  try {
    const data = await apiPost<SummaryResponse>('/api/summarize')
    aiSummary.value = data.summary || 'No summary received.'
  } catch (err: unknown) {
    console.error('Error fetching summary:', err)
    aiSummary.value =
      err instanceof Error ? err.message : 'Error: Could not get summary from server.'
  }
}

// Khi mở dialog → gọi backend để lấy summary
watch(aiDialogOpen, (open) => {
  if (open) fetchSummaryFromBackend()
})

// Handlers
function handleOpenDialog(note: Note) {
  openNote.value = note
}
function handleEditDialog(note: Note) {
  editNote.value = note
  editTitle.value = note.title
  editPreview.value = note.preview
}
function handleDeleteDialog(note: Note) {
  deleteNote.value = note
}
function confirmEdit() {
  if (!editNote.value) return
  editNote.value.title = editTitle.value
  editNote.value.preview = editPreview.value
  editNote.value.updatedAt = new Date().toLocaleString()
  editNote.value = null
}
function confirmDelete() {
  if (!deleteNote.value) return
  notesStore.deleteNote(deleteNote.value.id)
  deleteNote.value = null
}
</script>

<template>
  <section class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Your Notes</h1>
        <p class="text-sm text-muted-foreground">Search, browse and create notes.</p>
      </div>

      <div class="flex items-center gap-2">
        <Input v-model="query" type="search" placeholder="Search notes…" class="h-9 w-64" />
        <Button variant="outline" size="icon" class="h-9 w-9" aria-label="Search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </Button>

        <!-- 🧠 Summarize with AI -->
        <Dialog :open="aiDialogOpen" @update:open="(val) => (aiDialogOpen = val)">
          <DialogTrigger as-child>
            <Button size="sm" class="ml-1">Summarize with AI</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>AI Summary</DialogTitle>
              <DialogDescription>
                This summary is generated from all your notes using OpenAI.
              </DialogDescription>
            </DialogHeader>
            <p class="text-sm whitespace-pre-line">
              {{ aiSummary || 'Generating summary...' }}
            </p>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <Separator />

    <!-- Notes or Empty State -->
    <div v-if="filteredNotes.length > 0" class="space-y-4">
      <!-- Notes Grid -->
      <div
        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Notes list"
      >
        <Card
          v-for="n in pagedNotes"
          :key="n.id"
          class="group transition-colors hover:bg-accent/40"
        >
          <CardHeader>
            <CardTitle class="line-clamp-1">{{ n.title }}</CardTitle>
            <CardDescription class="line-clamp-2">{{ n.preview }}</CardDescription>
          </CardHeader>

          <CardContent class="flex justify-end">
            <time class="text-xs text-muted-foreground">{{ n.updatedAt }}</time>
          </CardContent>

          <CardFooter class="flex items-center justify-end gap-2">
            <!-- OPEN -->
            <Dialog :open="openNote?.id === n.id" @update:open="(val) => !val && (openNote = null)">
              <DialogTrigger as-child>
                <Button variant="outline" size="sm" @click="handleOpenDialog(n)">Open</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>{{ n.title }}</DialogTitle>
                  <DialogDescription>{{ n.updatedAt }}</DialogDescription>
                </DialogHeader>
                <p class="text-sm whitespace-pre-line">{{ n.preview }}</p>
                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <!-- EDIT -->
            <Dialog :open="editNote?.id === n.id" @update:open="(val) => !val && (editNote = null)">
              <DialogTrigger as-child>
                <Button variant="secondary" size="sm" @click="handleEditDialog(n)">Edit</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Edit Note</DialogTitle>
                  <DialogDescription>Update your note’s title or preview.</DialogDescription>
                </DialogHeader>

                <div class="grid gap-3 py-2">
                  <Input v-model="editTitle" placeholder="Title" class="h-9" />
                  <textarea
                    v-model="editPreview"
                    placeholder="Preview"
                    class="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring/60"
                  />
                </div>

                <DialogFooter class="gap-2">
                  <DialogClose as-child>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose as-child>
                    <Button @click="confirmEdit">Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <!-- DELETE -->
            <Dialog
              :open="deleteNote?.id === n.id"
              @update:open="(val) => !val && (deleteNote = null)"
            >
              <DialogTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive"
                  @click="handleDeleteDialog(n)"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Delete Note</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete <strong>{{ n.title }}</strong
                    >? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter class="gap-2">
                  <DialogClose as-child>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose as-child>
                    <Button variant="destructive" class="text-white" @click="confirmDelete">
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredNotes.length"
        class="flex flex-col items-center justify-between gap-3 sm:flex-row"
      >
        <div class="text-sm text-muted-foreground">
          {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, filteredNotes.length) }} of
          {{ filteredNotes.length }}
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="prev" :disabled="page === 1">Prev</Button>

          <Button
            v-for="p in totalPages"
            :key="p"
            size="sm"
            :variant="p === page ? 'default' : 'ghost'"
            class="min-w-9"
            @click="gotoPage(p)"
          >
            {{ p }}
          </Button>

          <Button variant="outline" size="sm" @click="next" :disabled="page === totalPages">
            Next
          </Button>

          <select
            v-model.number="pageSize"
            class="ml-2 h-9 rounded-md border border-border bg-background px-2 text-sm outline-none"
            aria-label="Items per page"
          >
            <option :value="6">6 / page</option>
            <option :value="9">9 / page</option>
            <option :value="12">12 / page</option>
            <option :value="24">24 / page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-lg border border-border bg-background/50 p-10 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 text-muted-foreground mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>

      <h2 class="text-lg font-medium text-foreground mb-2">No notes found</h2>
      <p class="text-sm text-muted-foreground mb-4">
        You haven’t created any notes yet. Start by adding a new one.
      </p>
    </div>
  </section>
</template>
