<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiBaseUrl } from '../../config'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const errorMsg = ref('')
const router = useRouter()

const handleRegister = async () => {
    if (!username.value || !password.value || !confirmPassword.value) {
        errorMsg.value = 'Mohon isi semua field'
        return
    }
    if (password.value !== confirmPassword.value) {
        errorMsg.value = 'Konfirmasi password tidak cocok'
        return
    }
    isSubmitting.value = true
    errorMsg.value = ''
    try {
        const res = await api.post(`/api/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value })
        })
        if (res.ok) {
            router.push('/admin/login')
        } else {
            const data = await res.json()
            errorMsg.value = data.error || 'Gagal mendaftar'
        }
    } catch (e) {
        errorMsg.value = 'Gagal menghubungi server database'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
  <div class="h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')] bg-cover bg-center bg-no-repeat font-sans">
    
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30"></div>

    <div class="relative z-10 w-full max-w-[1000px] shrink-0 flex flex-col md:flex-row rounded-[24px] overflow-hidden drop-shadow-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5">
        
        <div class="w-full md:w-1/2 bg-[#161616] p-8 md:p-12 flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-3 mb-16">
                    <img src="/images/Thp_logo.png" alt="Logo" class="w-10 h-10 object-contain drop-shadow-md" />
                    <span class="text-white font-bold text-sm tracking-wide">SMK TUNAS HARAPAN PATI</span>
                </div>
                <h1 class="text-white text-3xl lg:text-[40px] font-bold leading-[1.1] mb-6 tracking-wide">
                    Buat Ruang<br/>Kerja Baru<br/>Manajemen Anda.
                </h1>
                <p class="text-gray-400 text-sm leading-relaxed max-w-[90%] font-light">
                    Sistem informasi kelulusan terpadu SMK Tunas Harapan Pati. Silakan daftar untuk mendapatkan hak akses pengelolaan portal akademik.
                </p>
            </div>
        </div>

        <div class="w-full md:w-1/2 bg-[#313030] p-8 md:p-12 lg:px-14 flex flex-col justify-center">
            
            <h2 class="text-white text-2xl font-bold mb-10">Register Page Admin</h2>
            
            <form @submit.prevent="handleRegister" class="flex flex-col gap-5">
                
                <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-md font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {{ errorMsg }}
                </div>

                <div>
                    <label class="block text-[#7a7a7a] text-[10px] font-bold uppercase tracking-wider mb-2">Username Baru</label>
                    <input 
                        v-model="username"
                        type="text" 
                        placeholder="Ketik Username" 
                        class="w-full bg-[#e8e8e8] text-gray-800 placeholder-gray-400 font-medium text-sm rounded-md py-3.5 px-4 outline-none focus:ring-2 focus:ring-[#02498e]"
                    />
                </div>

                <div>
                    <label class="block text-[#7a7a7a] text-[10px] font-bold uppercase tracking-wider mb-2">Password Baru</label>
                    <input 
                        v-model="password"
                        type="password" 
                        placeholder="••••••••" 
                        class="w-full bg-[#e8e8e8] text-gray-800 placeholder-gray-400 font-medium text-sm rounded-md py-3.5 px-4 outline-none focus:ring-2 focus:ring-[#02498e]"
                    />
                </div>

                <div>
                    <label class="block text-[#7a7a7a] text-[10px] font-bold uppercase tracking-wider mb-2">Konfirmasi Password</label>
                    <input 
                        v-model="confirmPassword"
                        type="password" 
                        placeholder="••••••••" 
                        class="w-full bg-[#e8e8e8] text-gray-800 placeholder-gray-400 font-medium text-sm rounded-md py-3.5 px-4 outline-none focus:ring-2 focus:ring-[#02498e]"
                    />
                </div>

                <button type="submit" :disabled="isSubmitting" class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm py-4 rounded-md transition-all active:scale-[0.99] mt-4 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                    {{ isSubmitting ? 'Mendaftarkan...' : 'Daftar Sebagai Admin' }}
                </button>
            </form>

            <div class="mt-8 text-center">
                <p class="text-[#888] text-[10px] font-bold tracking-wider">
                    SUDAH PUNYA AKUN? <a href="/admin/login" class="text-blue-400 hover:underline">LOGIN SEKARANG</a>
                </p>
            </div>
        </div>

    </div>
  </div>
</template>
