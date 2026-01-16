<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useComments } from '../../composables/useComments'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    default: 'your project'
  }
})

const { user } = useAuth()
const { comments, addComment, deleteComment, error } = useComments(props.projectId)

const newComment = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
    if (!newComment.value.trim() || !user.value) return 

    isSubmitting.value = true
    await addComment({
        message: newComment.value,
        author: user.value.displayName,
        userId: user.value.uid,
        createdAt: new Date()
    }, props.ownerId, props.projectName)
    newComment.value = ''
    isSubmitting.value = false
}

const formattedDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat('default', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date)
}

</script>

<template>
  <div id="comments-section" class="project-comments glass-panel">
      <h3>Comments ({{ comments.length }})</h3>

      <div v-if="user && user.uid !== ownerId" class="add-comment">
          <form @submit.prevent="handleSubmit">
                <BaseInput 
                    v-model="newComment"
                    :isTextarea="true"
                    placeholder="Add a comment..."
                    required
                />
                <div class="form-actions">
                    <BaseButton type="submit" :loading="isSubmitting" :disabled="!newComment.trim()">
                        Post Comment
                    </BaseButton>
                </div>
          </form>
      </div>
      <div v-else-if="!user" class="login-prompt">
          <p>Please <router-link to="/login">login</router-link> to leave a comment.</p>
      </div>
      
      <div v-if="error" class="error">{{ error }}</div>

      <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-header">
                  <span class="author">{{ comment.author }}</span>
                  <span class="date">{{ formattedDate(comment.createdAt) }}</span>
              </div>
              <p class="content">{{ comment.message }}</p>
              <button 
                v-if="user && user.uid === comment.userId" 
                @click="deleteComment(comment.id)"
                class="delete-btn"
              >
                delete
              </button>
          </div>
      </div>
  </div>
</template>

<style scoped>
.project-comments {
    margin-top: 2rem;
    padding: 2rem;
}

h3 {
    margin-bottom: 1.5rem;
    color: var(--color-primary);
}

.add-comment {
    margin-bottom: 2rem;
}

.form-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
}

.login-prompt {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 2rem;
}

.login-prompt a {
    color: var(--color-primary);
    text-decoration: underline;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.comment-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.author {
    font-weight: bold;
    color: var(--color-text-main);
}

.date {
    color: var(--color-text-muted);
}

.content {
    line-height: 1.5;
    white-space: pre-wrap;
}

.delete-btn {
    background: none;
    border: none;
    color: var(--color-danger, #ff4d4d);
    font-size: 0.8rem;
    cursor: pointer;
    margin-top: 0.5rem;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.delete-btn:hover {
    opacity: 1;
    text-decoration: underline;
}

.error {
    color: var(--color-danger, #ff4d4d);
    margin-bottom: 1rem;
}
</style>
