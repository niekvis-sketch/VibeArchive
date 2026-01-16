<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'
import BaseInput from '../../components/ui/BaseInput.vue'
import BaseButton from '../../components/ui/BaseButton.vue'

const { login, error, loading } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (err) {
    console.error("Login failed", err)
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <p class="section-label">Welcome back</p>
          <h1>Sign in to your<br><span class="accent-text">account</span></h1>
          <p class="subtitle">Enter your credentials to access your portfolio</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-field">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="you@example.com"
              required
              class="input-field"
            />
          </div>
          
          <div class="form-field">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              required
              class="input-field"
            />
          </div>
          
          <div v-if="error" class="error-msg">
            <span>⚠️</span> {{ error }}
          </div>
          
          <BaseButton type="submit" :loading="loading" class="submit-btn">
            Sign in
          </BaseButton>

          <p class="switch-auth">
            Don't have an account? 
            <router-link to="/signup" class="link">Create one</router-link>
          </p>
        </form>
      </div>
      
      <div class="auth-visual">
        <div class="visual-content">
          <div class="visual-quote">
            <span class="quote-icon">"</span>
            <p>Design is not just what it looks like and feels like. Design is how it works.</p>
            <span class="quote-author">— Steve Jobs</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

@media (min-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr 1fr;
  }
}

.auth-card {
  padding: 2rem;
}

@media (min-width: 768px) {
  .auth-card {
    padding: 3rem;
  }
}

.auth-header {
  margin-bottom: 2.5rem;
}

.auth-header h1 {
  font-size: clamp(2rem, 5vw, 2.75rem);
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: all var(--speed-fast);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-orange);
  box-shadow: 0 0 0 3px var(--accent-orange-glow);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-danger);
  background: rgba(239, 68, 68, 0.1);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.switch-auth {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 1rem;
}

.link {
  color: var(--accent-orange);
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Visual side */
.auth-visual {
  display: none;
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-xl);
  padding: 3rem;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .auth-visual {
    display: flex;
  }
}

.visual-content {
  max-width: 320px;
}

.visual-quote {
  position: relative;
}

.quote-icon {
  font-size: 4rem;
  color: var(--accent-orange);
  line-height: 1;
  opacity: 0.5;
}

.visual-quote p {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 1rem 0;
}

.quote-author {
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>
