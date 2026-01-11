import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
    filter: {
        techStack: null,
        category: null,
        status: null,
        favorited: false
    }
  }),
  getters: {
    getProjectById: (state) => (id) => {
      return state.projects.find(project => project.id === id)
    }
  },
  actions: {
    async fetchProjects() {
      this.loading = true
      // Logic to fetch from Firebase will be here
      this.loading = false
    },
    async addProject(project) {
        // Add project logic
    }
  }
})
