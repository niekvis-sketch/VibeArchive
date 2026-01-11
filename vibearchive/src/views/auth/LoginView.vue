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
    // Error is handled in composable and displayed explicitly
    console.error("Login failed", err)
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="glass-panel auth-card">
        <h2 class="glow-text text-center">Welcome Back</h2>
        <p class="subtitle text-center">Enter the VibeArchive</p>

        <form @submit.prevent="handleLogin" class="auth-form">
            <BaseInput v-model="email" label="Email" type="email" required />
            <BaseInput v-model="password" label="Password" type="password" required />
            
            <div v-if="error" class="error-msg">{{ error }}</div>
            
            <BaseButton type="submit" :loading="loading" class="full-width">
                Login
            </BaseButton>

            <p class="switch-auth">
                No account yet? 
                <router-link to="/signup" class="link">Sign up here</router-link>
            </p>
        </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.auth-card {
    width: 100%;
    max-width: 450px;
    padding: 3rem;
}

.text-center { text-align: center; }

.subtitle {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    opacity: 0.7;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.full-width {
    width: 100%;
    margin-top: 1rem;
}

.error-msg {
    color: #ff4d4d;
    background: rgba(255, 77, 77, 0.1);
    padding: 0.8rem;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
}

.switch-auth {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.8;
}

.link {
    color: var(--accent-cyan);
    font-weight: 500;
}

.link:hover {
    text-decoration: underline;
}
</style>
