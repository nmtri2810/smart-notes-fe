<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
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
            <Button size="sm">New Note</Button>
          </div>
        </div>
        <Separator />
      </div>
    </header>

    <!-- Main (flex-1 keeps footer at bottom) -->
    <main class="container mx-auto px-4 py-6 flex-1">
      <RouterView />
    </main>

    <!-- Footer (sticks to bottom) -->
    <footer class="border-t">
      <div class="container mx-auto px-4 py-6 text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} smart-notes
      </div>
    </footer>
  </div>
</template>
