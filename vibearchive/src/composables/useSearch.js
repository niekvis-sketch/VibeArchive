import { ref, computed } from 'vue';

export function useSearch(projects) {
    const searchQuery = ref('');
    
    // Additional filter refs...

    const filteredProjects = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        
        // Return all projects if query is less than 3 characters
        if (!query || query.length < 3) return projects.value;
        
        return projects.value.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
    });

    return { searchQuery, filteredProjects };
}
