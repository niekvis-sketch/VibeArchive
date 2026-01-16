import { ref, computed } from 'vue';

export function useSearch(projects) {
    const searchQuery = ref('');
    const selectedTechStack = ref([]);
    const minVibeRating = ref(1);

    // Extract all unique tech stacks from projects
    const availableTechStacks = computed(() => {
        const techSet = new Set();
        projects.value.forEach(p => {
            if (p.techStack && Array.isArray(p.techStack)) {
                p.techStack.forEach(tech => techSet.add(tech));
            }
        });
        return [...techSet].sort();
    });

    // Toggle tech stack selection
    const toggleTechStack = (tech) => {
        const index = selectedTechStack.value.indexOf(tech);
        if (index === -1) {
            selectedTechStack.value.push(tech);
        } else {
            selectedTechStack.value.splice(index, 1);
        }
    };

    // Check if tech is selected
    const isTechSelected = (tech) => {
        return selectedTechStack.value.includes(tech);
    };

    // Clear all filters
    const clearFilters = () => {
        searchQuery.value = '';
        selectedTechStack.value = [];
        minVibeRating.value = 1;
    };

    // Check if any filters are active
    const hasActiveFilters = computed(() => {
        return searchQuery.value.trim().length >= 3 || 
               selectedTechStack.value.length > 0 || 
               minVibeRating.value > 1;
    });

    const filteredProjects = computed(() => {
        let result = projects.value;

        // Filter by search query (min 3 characters)
        const query = searchQuery.value.trim().toLowerCase();
        if (query && query.length >= 3) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        // Filter by tech stack
        if (selectedTechStack.value.length > 0) {
            result = result.filter(p => {
                if (!p.techStack || !Array.isArray(p.techStack)) return false;
                return selectedTechStack.value.every(tech => 
                    p.techStack.some(pTech => pTech.toLowerCase() === tech.toLowerCase())
                );
            });
        }

        // Filter by minimum vibe rating
        if (minVibeRating.value > 1) {
            result = result.filter(p => {
                const rating = Number(p.vibeRating) || 0;
                return rating >= minVibeRating.value;
            });
        }

        return result;
    });

    return { 
        searchQuery, 
        selectedTechStack,
        minVibeRating,
        availableTechStacks,
        toggleTechStack,
        isTechSelected,
        clearFilters,
        hasActiveFilters,
        filteredProjects 
    };
}
