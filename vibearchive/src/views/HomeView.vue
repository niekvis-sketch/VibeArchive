<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>
          Digital <br>
          <span class="accent-text">Archive</span>
        </h1>
        <p>Curating the future of digital experiences. Your personal archive for vibe-driven code.</p>
        
        <div class="cta-group">
          <button class="btn-primary" @click="router.push('/projects')">
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
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

h1 {
  font-size: clamp(3rem, 10vw, 6rem);
  line-height: 1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
  font-weight: 800;
}

p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 550px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--accent-orange);
  color: white;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--speed-fast) var(--ease-smooth);
}

.btn-primary:hover {
  background: var(--accent-orange-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-orange-glow);
}

.icon {
  transition: transform var(--speed-fast);
}

.btn-primary:hover .icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  p {
    font-size: 1.125rem;
  }
}
</style>
