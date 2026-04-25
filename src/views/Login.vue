<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiBaseUrl } from '../config'
import api from '../API'

const nis = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const router = useRouter()

const submitForm = async () => {
  if (!nis.value) return;
  isLoading.value = true;
  errorMsg.value = '';
  try {
    // Cek status pengumuman terlebih dahulu
    const annRes = await api.get('/api/announcement/status');
    const annData = annRes.data?.data;
    
    if (annData) {
      if (!annData.is_open) {
        errorMsg.value = 'Pengumuman belum dibuka oleh administrator.';
        isLoading.value = false;
        return;
      }

      if (annData.countdown) {
        const targetDate = new Date(annData.countdown);
        const now = new Date();
        if (targetDate > now) {
          errorMsg.value = 'Waktu pengumuman belum tiba. Silakan tunggu hitung mundur selesai.';
          isLoading.value = false;
          return;
        }
      }
    }
    
    // Jika sudah dibuka dan waktu sudah lewat, lanjutkan cek NIS
    const res = await api.post('/api/students/check', { nis: nis.value });
    if (res.data && res.data.success) {
      sessionStorage.setItem('studentResult', JSON.stringify(res.data.data));
      router.push('/result');
    } else {
      errorMsg.value = 'NIS tidak ditemukan atau tidak valid.';
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      errorMsg.value = 'Data siswa tidak ditemukan.';
    } else {
      errorMsg.value = 'Terjadi kesalahan jaringan, pastikan server aktif.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="relative min-h-screen w-full flex items-center justify-center sm:p-6 md:p-10 bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')] bg-cover bg-center bg-no-repeat font-sans">
    
    <!-- Central Dark Box (Full height on mobile, centered modal on desktop) -->
    <div class="relative z-10 w-full min-h-screen sm:min-h-0 md:max-w-[750px] lg:max-w-[850px] bg-[#2b2b2b]/95 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col sm:rounded-[20px] overflow-hidden">
      
      <!-- Content Wrapper -->
      <div class="flex flex-col h-full px-8 py-10 md:px-14 md:py-14 relative">
        
        <!-- Header / Logo -->
        <header class="flex items-center gap-4 lg:gap-5 mb-10 md:mb-12">
          <!-- Logo -->
          <div class="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center shrink-0 bg-transparent">
            <img src="/images/Thp_logo.png" alt="Logo SMKTHP" class="w-full h-full object-contain drop-shadow-md" />
          </div>
          <!-- School Information -->
          <div class="text-white">
            <h1 class="text-base sm:text-lg lg:text-[20px] font-bold tracking-wider m-0 leading-none text-gray-200">
              SMK TUNAS HARAPAN PATI
            </h1>
            <p class="text-[11px] sm:text-xs lg:text-[13px] text-gray-400 font-medium tracking-wide m-0 mt-1.5 leading-tight">
              Disiplin, Terampil, Prestasi, Siap kerja
            </p>
          </div>
        </header>

        <!-- Main Form Area -->
        <main class="flex-grow flex flex-col justify-center">
          
          <h2 class="text-3xl lg:text-[42px] font-bold text-white leading-[1.2] tracking-wide mb-2 pt-4">
            PENGUMUMAN KELULUSAN SMKTHP
          </h2>
          <h2 class="text-3xl lg:text-[42px] font-bold text-white leading-[1.2] tracking-wide mb-6">
            TAHUN 2026
          </h2>
          
          <p class="text-[#888888] text-sm md:text-[15px] mb-10 font-medium tracking-wide max-w-[90%]">
            Masukkan Nomor Induk Siswa Untuk Melihat Hasil Pengumuman
          </p>

          <form @submit.prevent="submitForm" class="flex flex-col w-full">
            <div class="mb-8">
              <label for="nis" class="block text-[#70a6bc] text-sm md:text-[16px] font-bold mb-3 tracking-wide">
                Nomor Induk Siswa (NIS)
              </label>
              <input 
                id="nis"
                v-model="nis"
                type="text" 
                placeholder="MASUKKAN NOMOR NIS ANDA" 
                class="w-full bg-[#565555] text-white placeholder-[#8e8e8e] rounded-xl py-4 px-5 md:py-[18px] md:px-6 text-sm font-bold tracking-wide outline-none focus:ring-2 focus:ring-[#078edd] border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              />
              <p v-if="errorMsg" class="text-red-400 text-xs mt-3 font-semibold">{{ errorMsg }}</p>
            </div>

            <div>
              <button 
                type="submit" 
                :disabled="isLoading"
                class="bg-[#058bdb] hover:bg-[#0477be] disabled:opacity-50 active:scale-[0.98] transition-all text-white font-bold tracking-wider py-3.5 px-8 rounded-full text-xs md:text-sm cursor-pointer inline-block border-none shadow-[0_4px_15px_rgba(5,139,219,0.3)]"
              >
                {{ isLoading ? 'MEMERIKSA...' : 'LIHAT HASIL PENGUMUMAN' }}
              </button>
            </div>
          </form>

        </main>

      </div>
    </div>
  </div>
</template>
