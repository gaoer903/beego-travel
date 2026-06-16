// composables/useAuth.ts
export const useAuth = () => {
  const user = useSupabaseUser();
  const supabaseClient = useSupabaseClient();

  const isLogin = computed(() => !!user.value);

  const logout = async () => {
    await supabaseClient.auth.signOut();
  };

  return {
    user,
    isLogin,
    logout,
  };
};
