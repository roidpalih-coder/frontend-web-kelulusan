<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../API/index.js'

const router = useRouter()
const student = ref(null)
const announcementMsg = ref('')

onMounted(async () => {
  const data = sessionStorage.getItem('studentResult')
  if (data) {
    student.value = JSON.parse(data)
  } else {
    router.push('/login')
  }

  try {
      const response = await api.get('/api/announcement/status')
      if (response.data && response.data.data && response.data.data.information) {
          announcementMsg.value = response.data.data.information
      }
  } catch(e) {
      console.error(e)
  }
})

const jurusanMap = {
    'TJKT': 'Teknik Jaringan Komputer dan Telekomunikasi',
    'TOI': 'Teknik Otomasi Industri',
    'TITL': 'Teknik Instalasi Tenaga Listrik',
    'KA': 'Kimia Analisis',
    'DKV': 'Desain Komunikasi Visual',
    'BCPF': 'Broadcasting dan Perfilman',
    'OTO': 'Teknik Otomotif',
    'LAS': 'Teknik Las',
    'MESIN': 'Teknik Mesin'
};  

const getFullJurusanName = (code) => {
    return jurusanMap[code.toUpperCase()] || code;
}
</script>

<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')] bg-cover bg-center bg-no-repeat font-sans overflow-hidden">
    
    <!-- Dark overlay for the main background -->
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- The Result Card -->
    <div class="relative z-10 w-full max-w-5xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
      
      <!-- Top Status Box -->
      <div class="px-8 py-8 md:px-12 md:py-10 flex items-center justify-between" :class="student?.keterangan === 'TidakLulus' ? 'bg-[#c22d2d]' : 'bg-[#0b5394]'">
        <h2 class="text-white text-xl sm:text-2xl md:text-[28px] font-bold leading-[1.4] tracking-wide max-w-[80%] uppercase">
          <span v-if="student?.keterangan === 'TidakLulus'">MOHON MAAF! ANDA DINYATAKAN TIDAK LULUS</span>
          <span v-else>SELAMAT! ANDA DINYATAKAN LULUS</span><br />
          DARI SMK TUNAS HARAPAN PATI<br />
          TAHUN AJARAN 2025/2026.
        </h2>
        
        <!-- Right side logo -->
        <div class="w-20 h-20 md:w-24 md:h-24 shrink-0">
          <img src="/images/Thp_logo.png" alt="Logo SMK" class="w-full h-full object-contain drop-shadow-md" />
        </div>
      </div>

      <!-- Bottom Dark Box -->
      <div class="bg-[#2a2a2a]/95 px-8 py-8 md:px-12 md:py-10 flex flex-col">
        
        <!-- Header Info -->
        <div class="mb-8 border-b border-gray-600/40 pb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          
          <!-- Left Info: Personal Data -->
          <div class="flex-grow">
            <h1 class="text-white text-3xl sm:text-4xl md:text-[42px] font-bold mb-8 tracking-wide uppercase">
              {{ student?.nama || '......' }}
            </h1>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <!-- Grid item -->
              <div>
                <p class="text-[#70a6bc] text-xs sm:text-sm font-semibold mb-1">Sekolah</p>
                <p class="text-white text-sm sm:text-base font-semibold tracking-wide">SMK TUNAS HARAPAN PATI</p>
              </div>
              <!-- Grid item -->
              <div>
                <p class="text-[#70a6bc] text-xs sm:text-sm font-semibold mb-1">Kabupaten/Kota</p>
                <p class="text-white text-sm sm:text-base font-semibold tracking-wide">Kab. Pati</p>
              </div>
              <!-- Grid item -->
              <div>
                <p class="text-[#70a6bc] text-xs sm:text-sm font-semibold mb-1">Jurusan</p>
                <p class="text-white text-sm sm:text-base font-semibold tracking-wide">{{ student ? getFullJurusanName(student.jurusan) : '......' }}</p>
              </div>
              <!-- Grid item -->
              <div>
                <p class="text-[#70a6bc] text-xs sm:text-sm font-semibold mb-1">Provinsi</p>
                <p class="text-white text-sm sm:text-base font-semibold tracking-wide">Jawa Tengah</p>
              </div>
            </div>
          </div>

          <!-- Right Info: QR Code -->
          <!-- Container for QR Code with color boundary -->
          <div class="shrink-0 bg-white p-2 border-[6px] border-[#0b5394] rounded-lg self-start shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${student?.nis || '00000'}`" alt="QR Code" class="w-32 h-32 md:w-48 md:h-48 object-contain" />
          </div>

        </div>

        <!-- Footer Motivation Text (from DB) -->
        <div>
          <p class="text-[#8e8e8e] text-[11px] sm:text-sm leading-relaxed max-w-[95%] font-medium whitespace-pre-wrap">
            {{ announcementMsg }}
          </p>
        </div>

      </div>

    </div>
  </div>
</template>
