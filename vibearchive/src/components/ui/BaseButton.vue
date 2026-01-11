<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :type="type" :class="['btn', `btn-${variant}`, { loading }]">
    <span v-if="loading" class="spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 0.8rem 1.5rem;
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--transition-speed);
  border-radius: 4px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 15px var(--color-primary);
}

.btn-secondary {
  background: rgba(181, 55, 242, 0.1);
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-secondary);
  color: var(--color-bg);
  box-shadow: 0 0 15px var(--color-secondary);
}

.btn-danger {
  background: rgba(255, 46, 151, 0.1);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-text);
  box-shadow: 0 0 15px var(--color-accent);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
