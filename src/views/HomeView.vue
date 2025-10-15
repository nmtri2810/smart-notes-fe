<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import Badge from '@/components/ui/badge/Badge.vue'

import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'

import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'

type Note = { id: number; title: string; preview: string; updatedAt: string; tag?: string }

const query = ref('')
const notes = ref<Note[]>([
  {
    id: 1,
    title: 'Project ideas',
    preview: 'Capture ideas for Q4…',
    updatedAt: '2025-10-12 14:36',
    tag: 'work',
  },
  {
    id: 2,
    title: 'Grocery list',
    preview: 'Milk, matcha, eggs…',
    updatedAt: '2025-10-14 09:10',
    tag: 'personal',
  },
  {
    id: 3,
    title: 'Workout log',
    preview: 'Ankle rehab + sled sprints…',
    updatedAt: '2025-10-15 07:30',
    tag: 'health',
  },
])

const filtered = computed(() =>
  notes.value.filter((n) =>
    (n.title + ' ' + n.preview).toLowerCase().includes(query.value.toLowerCase()),
  ),
)

const newTitle = ref('')
const newPreview = ref('')

function createNote() {
  if (!newTitle.value.trim()) return
  notes.value.unshift({
    id: Date.now(),
    title: newTitle.value,
    preview: newPreview.value,
    updatedAt: new Date().toLocaleString(),
  })
  newTitle.value = ''
  newPreview.value = ''
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
        <!-- New note dialog -->
        <Dialog>
          <DialogTrigger as-child>
            <Button size="sm">New Note</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Create a new note</DialogTitle>
              <DialogDescription>Title and a short preview/summary.</DialogDescription>
            </DialogHeader>

            <div class="grid gap-3 py-2">
              <Input v-model="newTitle" placeholder="Title" class="h-9" />
              <textarea
                v-model="newPreview"
                placeholder="Preview"
                class="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring/60"
              />
            </div>

            <DialogFooter class="gap-2">
              <DialogClose as-child>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose as-child>
                <Button @click="createNote">Create</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <Separator />

    <!-- List -->
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="Notes list"
    >
      <Card v-for="n in filtered" :key="n.id" class="group transition-colors hover:bg-accent/40">
        <CardHeader class="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle class="line-clamp-1">{{ n.title }}</CardTitle>
            <CardDescription class="line-clamp-2">{{ n.preview }}</CardDescription>
          </div>

          <!-- Per-note menu -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">⋯</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-40">
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem class="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent class="flex items-center justify-between">
          <Badge variant="secondary" v-if="n.tag">{{ n.tag }}</Badge>
          <time class="text-xs text-muted-foreground">{{ n.updatedAt }}</time>
        </CardContent>

        <CardFooter class="flex items-center gap-2">
          <Button variant="outline" size="sm">Open</Button>
          <Button variant="ghost" size="sm">Delete</Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="rounded-lg border p-8 text-center">
      <p class="text-sm text-muted-foreground">No notes found.</p>
      <div class="mt-3">
        <Button>Create your first note</Button>
      </div>
    </div>
  </section>
</template>
