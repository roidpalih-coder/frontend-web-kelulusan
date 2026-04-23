<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '../../API/index.js'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
    if (!username.value || !password.value) {
        errorMsg.value = 'Mohon isi semua field'
        return
    }
    isSubmitting.value = true
    errorMsg.value = ''
    try {
        const res = await api.post('/api/admin/login', { username: username.value, password: password.value })
        localStorage.setItem('isAdmin', 'true')
        if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token)
        }
        router.push('/admin/dashboard')
    } catch (e) {
        if (e.response && e.response.data && e.response.data.error) {
            errorMsg.value = e.response.data.error
        } else {
            errorMsg.value = 'Username atau sandi tidak valid atau Gagal menghubungi server database'
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
  <div class="h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')] bg-cover bg-center bg-no-repeat font-sans">
    
    <!-- Dark gradient overlay for background shadow -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30"></div>

    <!-- Login Card Container -->
    <div class="relative z-10 w-full max-w-[1000px] shrink-0 flex flex-col md:flex-row rounded-[24px] overflow-hidden drop-shadow-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5">
        
        <!-- Left Side (Now Dark) -->
        <div class="w-full md:w-1/2 bg-[#161616] p-8 md:p-12 flex flex-col justify-between">
            
            <div>
                <!-- Header -->
                <div class="flex items-center gap-3 mb-16">
                    <img src="/images/Thp_logo.png" alt="Logo" class="w-10 h-10 object-contain drop-shadow-md" />
                    <span class="text-white font-bold text-sm tracking-wide">
                        SMK TUNAS HARAPAN PATI
                    </span>
                </div>

                <!-- Welcome Text -->
                <h1 class="text-white text-3xl lg:text-[40px] font-bold leading-[1.1] mb-6 tracking-wide">
                    Selamat datang di <br/>website Kelulusan<br/>Tunas Harapan Pati.
                </h1>
                
                <p class="text-gray-400 text-sm leading-relaxed max-w-[90%] font-light">
                    Sistem informasi kelulusan terpadu SMK Tunas Harapan Pati. Silakan masuk menggunakan kredensial yang sah untuk mengakses portal administrasi data akademik.
                </p>
            </div>
        </div>

        <!-- Right Side (Dark Form) -->
        <div class="w-full md:w-1/2 bg-[#313030] p-8 md:p-12 lg:px-14 flex flex-col justify-center">
            
            <h2 class="text-white text-2xl font-bold mb-10">Login Page Admin</h2>
            
            <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
                
                <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-md font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {{ errorMsg }}
                </div>
                
                <!-- Username Field -->
                <div>
                    <label class="block text-[#7a7a7a] text-[10px] font-bold uppercase tracking-wider mb-2">Username</label>
                    <div class="relative items-center">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input 
                            v-model="username"
                            type="text" 
                            placeholder="Masukkan Username" 
                            class="w-full bg-[#e8e8e8] text-gray-800 placeholder-gray-400 font-medium text-sm rounded-md py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#02498e]"
                        />
                    </div>
                </div>

                <!-- Password Field -->
                <div>
                    <label class="block text-[#7a7a7a] text-[10px] font-bold uppercase tracking-wider mb-2">Password</label>
                    <div class="relative items-center">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            v-model="password"
                            type="password" 
                            placeholder="••••••••" 
                            class="w-full bg-[#e8e8e8] text-gray-800 placeholder-gray-400 font-medium text-sm rounded-md py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#02498e]"
                        />
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Remember Me -->
                <div class="flex items-center mt-1">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded text-[#02498e] bg-[#e8e8e8] border-none focus:ring-0 cursor-pointer" />
                        <span class="text-[#888888] text-xs font-medium">Remember Me</span>
                    </label>
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="isSubmitting" class="w-full bg-[#035bb1] hover:bg-[#034d96] text-white font-bold text-sm py-4 rounded-md transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50">
                    {{ isSubmitting ? 'Memeriksa Kredensial...' : 'Sign In to Curator' }}
                    <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>

            <!-- Footer Links -->
            <div class="mt-14 text-center">
                <p class="text-[#5a5a5a] text-[11px] leading-relaxed max-w-[95%] mx-auto mb-4">
                    Authorized Access Only. All activities are logged and monitored for security compliance. Belum memiliki akun admin? <a href="/admin/register" class="text-blue-400 font-bold hover:underline">Register</a>
                </p>
                <div class="flex items-center justify-center gap-6">
                    <a href="#" class="text-[#7a7a7a] hover:text-gray-300 text-[10px] uppercase font-bold tracking-wider transition-colors">Privacy Policy</a>
                    <a href="#" class="text-[#7a7a7a] hover:text-gray-300 text-[10px] uppercase font-bold tracking-wider transition-colors">Support Desk</a>
                </div>
            </div>

        </div>

    </div>
  </div>
</template>
