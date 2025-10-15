<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'

import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'

import Input from '@/components/ui/input/Input.vue'
import { ref } from 'vue'
import { useNotesStore } from '@/stores/notes'

const notesStore = useNotesStore()
const newTitle = ref('')
const newPreview = ref('')

function handleCreate() {
  if (!newTitle.value.trim()) return
  notesStore.createNote({ title: newTitle.value, preview: newPreview.value })
  newTitle.value = ''
  newPreview.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <!-- Header -->
    <header class="border-b bg-background/80 backdrop-blur">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-3">
          <!-- Brand -->
          <RouterLink to="/" class="text-xl font-semibold tracking-tight hover:opacity-90">
            smart-notes
          </RouterLink>

          <!-- Nav -->
          <nav class="flex items-center gap-2">
            <RouterLink
              to="/"
              class="px-3 py-1.5 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground"
              active-class="bg-accent/60 text-foreground"
              exact-active-class="bg-primary/10 text-primary font-semibold"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="px-3 py-1.5 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground"
              active-class="bg-accent/60 text-foreground"
              exact-active-class="bg-primary/10 text-primary font-semibold"
            >
              About
            </RouterLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm">Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-44">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Global New Note dialog -->
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
                    <Button @click="handleCreate">Create</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator />
      </div>
    </header>

    <!-- Main -->
    <main class="container mx-auto px-4 py-6 flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t">
      <div class="container mx-auto px-4 py-6 text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} smart-notes
      </div>
    </footer>
  </div>
</template>
