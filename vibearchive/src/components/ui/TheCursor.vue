<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref(null)
const follower = ref(null)

const moveCursor = (e) => {
    if (!cursor.value || !follower.value) return
    
    // Main cursor
    cursor.value.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    
    // Follower (delayed)
    follower.value.animate({
        transform: `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`
    }, {
        duration: 500,
        fill: "forwards"
    })
}

onMounted(() => {
    window.addEventListener('mousemove', moveCursor)
})

onUnmounted(() => {
    window.removeEventListener('mousemove', moveCursor)
})
</script>

<template>
  <div class="cursor-wrapper">
    <div ref="cursor" class="custom-cursor"></div>
    <div ref="follower" class="cursor-follower"></div>
  </div>
</template>

<style scoped>
.custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background: var(--accent-cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
}

.cursor-follower {
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border: 1px solid var(--accent-cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    background: rgba(0, 212, 255, 0.05);
    transition: width 0.3s, height 0.3s, background 0.3s;
}

/* Expansion on hover logic would go here via global class toggling */
</style>
