import { defineStore, skipHydrate } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '~/types'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string>('')

    const isLoggedIn = computed(() => !!user.value && !!token.value)
    const isVip = computed(() => user.value?.isVip ?? false)
    const nickname = computed(() => user.value?.nickname ?? '游客')

    function login(payload: { user: User; token: string }) {
      user.value = payload.user
      token.value = payload.token
    }

    function logout() {
      user.value = null
      token.value = ''
    }

    /** mock 登录：先用本地状态跑通 UI */
    function mockLogin() {
      login({
        user: {
          id: 'mock-1',
          nickname: '拔草试用用户',
          avatar: 'https://i.pravatar.cc/100?img=12',
          phone: '138****8888',
          isVip: false,
        },
        token: 'mock-token-xxx',
      })
    }

    return {
      user: skipHydrate(user),
      token: skipHydrate(token),
      isLoggedIn,
      isVip,
      nickname,
      login,
      logout,
      mockLogin,
    }
  },
  {
    persist: {
      pick: ['user', 'token'],
      storage: piniaPluginPersistedstate.localStorage(),
    },
  },
)
