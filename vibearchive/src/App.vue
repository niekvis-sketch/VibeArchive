<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/layout/NavBar.vue'
</script>

<template>
  <div class="app-layout">
    <div class="noise-overlay"></div>
    <NavBar />
    <main class="container">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

main {
  flex: 1;
  padding: 2rem 0;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
