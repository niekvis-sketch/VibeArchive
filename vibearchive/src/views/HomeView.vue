<script setup>
import { useRouter } from 'vue-router'
// import { vMotion } from '@vueuse/motion' - Removed explicit import

const router = useRouter()
</script>

<template>
  <div class="home">
    <section class="hero">
      <div 
        class="hero-content"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
      >
        <h1 class="glow-text">
            Digital <br>
            <span class="gradient-text">Sanctuary</span>
        </h1>
        <p>Curating the future of digital experiences. Your personal archive for vibe-driven code.</p>
        
        <div class="cta-group">
            <button class="primary-cta" @click="router.push('/projects')">
                Explore Archive
                <span class="icon">→</span>
            </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4rem;
}

.hero-content {
    text-align: center;
    max-width: 900px;
}

h1 {
    font-size: 6rem;
    line-height: 1;
    margin-bottom: 2rem;
    letter-spacing: -0.04em;
    font-weight: 800;
}

p {
    font-size: 1.5rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto 3rem;
    line-height: 1.6;
}

.primary-cta {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 1.2rem 3rem;
    font-size: 1.2rem;
    border-radius: 50px;
    font-family: var(--font-display);
    cursor: pointer;
    transition: all 0.4s var(--ease-spring);
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    overflow: hidden;
}

.primary-cta::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradient-main);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s;
}

.primary-cta:hover {
    border-color: transparent;
    transform: scale(1.05);
}

.primary-cta:hover::before {
    opacity: 1;
}

@media (max-width: 768px) {
    h1 { font-size: 3.5rem; }
}
</style>
