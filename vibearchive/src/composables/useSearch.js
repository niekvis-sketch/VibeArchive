import { ref, computed } from 'vue';

export function useSearch(projects) {
    const searchQuery = ref('');
    
    // Additional filter refs...

    const filteredProjects = computed(() => {
        if (!searchQuery.value) return projects.value;
        return projects.value.filter(p => 
            p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
            p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });

    return { searchQuery, filteredProjects };
}
