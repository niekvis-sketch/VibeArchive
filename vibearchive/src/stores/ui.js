import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: false,
    activeTheme: 'dark'
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
})
