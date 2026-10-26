<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Login Admin — School Smart Digital',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const route = useRoute()
const router = useRouter()
const { loggedIn, fetch: refreshSession } = useUserSession()

// If already logged in, redirect to admin dashboard
if (loggedIn.value) {
  const target = (route.query.redirect as string) || '/admin/dashboard'
  router.replace(target)
}

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  if (!form.email || !form.password) {
    errorMessage.value = 'Email dan kata sandi wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    })

    await refreshSession()
    const target = (route.query.redirect as string) || '/admin/dashboard'
    await router.push(target)
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Email atau kata sandi salah. Silakan periksa kembali.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-[var(--ssd-background,#f6f9fc)] flex flex-col justify-center items-center px-4 py-12">
    <!-- Brand Header -->
    <div class="w-full max-w-md text-center mb-8">
      <div class="inline-flex items-center justify-center mb-4">
        <BrandLogo variant="default" size="xl" :show-text="false" />
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--color-navy-900,#12355b)] font-display">
        Admin Portal SSD
      </h1>
      <p class="text-sm text-[var(--color-secondary,#46607a)] mt-1 font-body">
        Sistem Manajemen Prospek & Demo School Smart Digital
      </p>
    </div>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-white rounded-2xl border border-[var(--ssd-border,#d7e2ec)] shadow-[0_8px_24px_rgb(10_32_54/0.06)] p-6 sm:p-8">
      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        role="alert"
        class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
      >
        <span class="text-red-500 font-bold" aria-hidden="true">⚠️</span>
        <span class="flex-1">{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
        <!-- Email Field -->
        <div>
          <label for="admin-email" class="block text-xs font-semibold uppercase tracking-wider text-[var(--color-navy-900,#12355b)] mb-2 font-mono">
            Email Administrator
          </label>
          <input
            id="admin-email"
            v-model="form.email"
            type="email"
            autocomplete="username"
            required
            placeholder="admin@schoolsmartdigital.com"
            :disabled="isLoading"
            class="w-full px-4 py-3 rounded-xl border border-[var(--ssd-border,#d7e2ec)] bg-white text-[var(--color-navy-900,#12355b)] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[var(--color-navy-900,#12355b)] focus:ring-offset-1 transition"
          />
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="admin-password" class="block text-xs font-semibold uppercase tracking-wider text-[var(--color-navy-900,#12355b)] font-mono">
              Kata Sandi
            </label>
          </div>
          <div class="relative">
            <input
              id="admin-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              placeholder="••••••••"
              :disabled="isLoading"
              class="w-full px-4 py-3 pr-11 rounded-xl border border-[var(--ssd-border,#d7e2ec)] bg-white text-[var(--color-navy-900,#12355b)] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[var(--color-navy-900,#12355b)] focus:ring-offset-1 transition"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
            >
              <span class="text-xs font-mono font-medium">{{ showPassword ? 'HIDE' : 'SHOW' }}</span>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full mt-2 py-3.5 px-4 rounded-xl bg-[var(--color-navy-900,#12355b)] hover:bg-[var(--color-navy-800,#1b4673)] active:bg-[var(--color-navy-950,#0a2036)] text-white font-semibold text-sm transition-colors duration-150 shadow-sm focus:outline-none focus:ring-3 focus:ring-[var(--color-cyan-500,#00b4d8)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
          <span>{{ isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard' }}</span>
        </button>
      </form>
    </div>

    <!-- Security Footnote -->
    <p class="mt-8 text-center text-xs text-[var(--color-secondary,#46607a)] font-mono max-w-sm">
      Akses terbatas hanya untuk staf & pengelola resmi SSD. Sesi terenkripsi & diaudit.
    </p>
  </main>
</template>
