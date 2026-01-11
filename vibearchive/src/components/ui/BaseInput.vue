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
      class="glass-input"
      rows="4"
    ></textarea>
    
    <input 
      v-else
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      class="glass-input"
    >
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-heading);
  color: var(--color-primary);
  font-size: 0.9rem;
}

.glass-input {
  width: 100%;
  background: rgba(10, 14, 39, 0.4);
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: var(--color-text);
  padding: 0.8rem;
  border-radius: 4px;
  font-family: var(--font-body);
  transition: all var(--transition-speed);
}

.glass-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  background: rgba(10, 14, 39, 0.8);
}
</style>
