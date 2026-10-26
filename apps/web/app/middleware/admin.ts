export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo({
      path: '/admin/login',
      query: to.path !== '/admin/leads' ? { redirect: to.fullPath } : undefined,
    })
  }
})
