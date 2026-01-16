<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :type="type" :class="['btn', `btn-${variant}`, `btn-${size}`, { loading }]" :disabled="loading">
    <span v-if="loading" class="spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--speed-fast) var(--ease-smooth);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* Sizes */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Primary - Orange filled */
.btn-primary {
  background: var(--accent-orange);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-orange-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--accent-orange-glow);
}

/* Secondary - Outlined */
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Ghost - No border */
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

/* Danger */
.btn-danger {
  background: var(--accent-danger);
  border: none;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.spinner {
  width: 1.125em;
  height: 1.125em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
