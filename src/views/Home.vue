<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../API/index.js'

const days = ref('00')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('15')

// Target waktu
const targetDate = ref(null)
const formattedTargetDate = ref('Menunggu Tanggal...')

let timer = null

const fetchAnnouncementStatus = async () => {
    try {
        const response = await api.get('/api/announcement/status')
        if (response.data && response.data.data && response.data.data.countdown) {
            targetDate.value = new Date(response.data.data.countdown)
            const formatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            formattedTargetDate.value = formatter.format(targetDate.value).replace(/\./g, ':').toUpperCase();
        }
    } catch(e) {
        console.error(e)
    }
}

const updateCountdown = () => {
  if (!targetDate.value) return;

  const now = new Date()
  const diff = targetDate.value - now

  if (diff <= 0) {
    days.value = '00'
    hours.value = '00'
    minutes.value = '00'
    seconds.value = '00'
    if (timer) clearInterval(timer)
    return
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  days.value = String(d).padStart(2, '0')
  hours.value = String(h).padStart(2, '0')
  minutes.value = String(m).padStart(2, '0')
  seconds.value = String(s).padStart(2, '0')
}

const isAdmin = ref(false)

onMounted(async () => {
  await fetchAnnouncementStatus();
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <!-- Background Container -->
  <div class="relative min-h-screen w-full bg-cover bg-center bg-no-repeat font-sans bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')]">
    
    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Main Flex Layout -->
    <div class="relative z-10 flex flex-col min-h-screen w-full">
      
      <!-- Header Area -->
      <header class="absolute top-0 left-0 w-full flex items-center p-6 lg:p-8 z-20">
        <div class="flex items-center gap-3 lg:gap-4">
          <!-- Logo Placeholder -->
          <div class="w-10 h-10 lg:w-14 lg:h-14 bg-transparent rounded-full flex items-center justify-center overflow-hidden shrink-0">
            <img src="/images/Thp_logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <!-- School Information -->
          <div class="text-white">
            <h1 class="text-[15px] sm:text-lg lg:text-xl font-semibold tracking-wide m-0 leading-none text-gray-100">
              SMK TUNAS HARAPAN PATI
            </h1>
            <p class="text-[10px] sm:text-[11px] lg:text-xs text-gray-300 font-light tracking-wide m-0 mt-1 max-w-[200px] sm:max-w-none leading-tight">
              Disiplin, Terampil, Prestasi, Siap kerja
            </p>
          </div>
        </div>
      </header>

      <!-- Center Content Area for Countdown Box -->
      <main class="flex-grow flex items-center justify-center p-4 sm:p-6 w-full h-screen">
        
        <div class="w-full max-w-5xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <!-- Top Blue Box: Countdown -->
          <div class="bg-[#1e5fba] text-white py-6 sm:py-8 lg:py-12 px-2 sm:px-6 lg:px-16 flex justify-center items-center">
            
            <!-- Hari -->
            <div class="flex flex-col items-center">
              <span class="text-[10px] sm:text-xs lg:text-sm tracking-wide lg:tracking-widest mb-1 sm:mb-2 lg:mb-5 font-semibold text-white uppercase font-sans">Hari</span>
              <span class="text-4xl sm:text-6xl md:text-[80px] lg:text-[110px] font-bold leading-none">{{ days }}</span>
            </div>
            
            <!-- Separator -->
            <div class="text-2xl sm:text-4xl md:text-[60px] lg:text-[90px] font-bold leading-none mt-2 sm:mt-4 md:mt-8 lg:mt-12 mx-1 sm:mx-3 lg:mx-4">:</div>
            
            <!-- Jam -->
            <div class="flex flex-col items-center">
              <span class="text-[10px] sm:text-xs lg:text-sm tracking-wide lg:tracking-widest mb-1 sm:mb-2 lg:mb-5 font-semibold text-white uppercase font-sans">Jam</span>
              <span class="text-4xl sm:text-6xl md:text-[80px] lg:text-[110px] font-bold leading-none">{{ hours }}</span>
            </div>
            
            <!-- Separator -->
            <div class="text-2xl sm:text-4xl md:text-[60px] lg:text-[90px] font-bold leading-none mt-2 sm:mt-4 md:mt-8 lg:mt-12 mx-1 sm:mx-3 lg:mx-4">:</div>
            
            <!-- Menit -->
            <div class="flex flex-col items-center">
              <span class="text-[10px] sm:text-xs lg:text-sm tracking-wide lg:tracking-widest mb-1 sm:mb-2 lg:mb-5 font-semibold text-white uppercase font-sans">Menit</span>
              <span class="text-4xl sm:text-6xl md:text-[80px] lg:text-[110px] font-bold leading-none">{{ minutes }}</span>
            </div>
            
            <!-- Separator -->
            <div class="text-2xl sm:text-4xl md:text-[60px] lg:text-[90px] font-bold leading-none mt-2 sm:mt-4 md:mt-8 lg:mt-12 mx-1 sm:mx-3 lg:mx-4">:</div>
            
            <!-- Detik -->
            <div class="flex flex-col items-center">
              <span class="text-[10px] sm:text-xs lg:text-sm tracking-wide lg:tracking-widest mb-1 sm:mb-2 lg:mb-5 font-semibold text-white uppercase font-sans">Detik</span>
              <span class="text-4xl sm:text-6xl md:text-[80px] lg:text-[110px] font-bold leading-none">{{ seconds }}</span>
            </div>

          </div>

          <!-- Bottom Dark Box: Info -->
          <div class="bg-[#2b2b2b]/95 px-4 sm:px-6 lg:px-10 py-4 lg:py-5 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2 sm:gap-4">
            <span class="font-bold text-xs sm:text-sm lg:text-[15px] tracking-wide text-[#dcdcdc] order-2 md:order-1">
              PENGUMUMAN KELULUSAN SMKTHP 2026
            </span>
            <span class="text-xs sm:text-sm lg:text-[15px] text-[#9a9a9a] uppercase tracking-wide order-1 md:order-2 font-medium">
              DIBUKA TANGGAL {{ formattedTargetDate }} WIB
            </span>
          </div>
        </div>

      </main>

    </div>

    <!-- Back to Admin Floating Button -->
    <a v-if="isAdmin" href="/admin/dashboard" class="fixed bottom-10 right-10 z-50 bg-[#1a2b4c]/90 backdrop-blur-md hover:bg-[#20365d] border border-[#2a3b5c] text-[#8ab4f8] font-bold py-4 px-8 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all flex items-center gap-3 drop-shadow-2xl">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Kembali ke Halaman Admin
    </a>

  </div>
</template>
