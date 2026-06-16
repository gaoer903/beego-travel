// composables/useLoginModal.ts
export const useLoginModal = () => {
  const visible = useState('login-modal', () => false)

  const open = () => {
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  return {
    visible,
    open,
    close,
  }
}