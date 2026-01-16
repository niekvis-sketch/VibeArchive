<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  isTextarea: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    
    <textarea 
      v-if="isTextarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      class="input-field"
      rows="4"
    ></textarea>
    
    <input 
      v-else
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      class="input-field"
    >
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.input-field {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  transition: all var(--speed-fast) var(--ease-smooth);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-orange);
  box-shadow: 0 0 0 3px var(--accent-orange-glow);
  background: var(--bg-card);
}

textarea.input-field {
  resize: vertical;
  min-height: 120px;
}
</style>
