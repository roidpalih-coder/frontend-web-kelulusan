<script setup>
import { ref } from 'vue'
import api from '../../API/index.js'


const menuItems = [
  { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: false },
  { name: 'Impor CSV/Excel', icon: 'M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: true }
]

const historyList = ref([
    { name: 'batch_lulusan_2024_A.csv', size: '4.2 MB - 1.152 REKAMAN', date: '24 Okt 2023, 09:41', status: 'BERHASIL' },
    { name: 'revisi_it_dept_v2.csv', size: '1.5 MB - 52 REKAMAN', date: '22 Okt 2023, 14:15', status: 'BERHASIL' },
    { name: 'data_siswa_tidak_valid.csv', size: '0.8 MB - 0 REKAMAN', date: '20 Okt 2023, 11:05', status: 'GAGAL' },
])

const fileInput = ref(null)
const isUploading = ref(false)
const showSuccessModal = ref(false)
const uploadedFileName = ref('')
const selectedFile = ref('')
const isSidebarOpen = ref(window.innerWidth >= 768)

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value

const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    selectedFile.value = file.name
    
    const formData = new FormData()
    formData.append('file', file)
    isUploading.value = true
    const endpoint = file.name.toLowerCase().endsWith('.csv') ? '/api/admin/students/import-csv' : '/api/admin/students/import-excel';
    try {
        const response = await api.post(endpoint, formData)
        
        if (response.status === 200 || response.data) {
            uploadedFileName.value = file.name
            showSuccessModal.value = true
        } else {
            console.error("Gagal mengimpor data")
            alert('Gagal mengimpor data')
        }
    } catch (error) {
        console.error('Error uploading file:', error)
        alert('Terjadi kesalahan saat mengunggah file. Pastikan server backend Anda berjalan pada port 3000.')
    } finally {
        isUploading.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const triggerFileInput = () => {
    if (fileInput.value) fileInput.value.click()
}

const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
        const event = { target: { files: [files[0]] } }
        handleFileUpload(event)
    }
}

const preventDefaults = (e) => e.preventDefault()

const dismissSuccessModal = () => {
    showSuccessModal.value = false
    window.location.href = '/admin/dashboard'
}

const logout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('token')
    window.location.href = '/admin/login'
}
</script>

<template>
  <div class="min-h-screen w-full flex bg-[#0a0a0a] font-sans">
    
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none"></div>

    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-[#242424] fixed top-0 w-full z-40">
        <div class="flex items-center gap-3">
            <img src="/images/Thp_logo.png" class="w-8 h-8 object-contain" />
            <span class="text-white font-bold text-xs uppercase">Tunas Harapan Pati</span>
        </div>
        <button @click="toggleSidebar" class="text-gray-400 hover:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
    </div>

    <!-- Mobile Overlay -->
    <div v-show="isSidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black/60 z-40 md:hidden"></div>

    <!-- Sidebar Left -->
    <aside :class="['bg-[#111111] shrink-0 flex flex-col h-screen fixed md:sticky top-0 border-r border-[#242424] z-50 overflow-x-hidden overflow-y-auto transition-all duration-300', isSidebarOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full border-none']">
      
      <div class="p-6 flex items-center gap-3">
        <img src="/images/Thp_logo.png" alt="Logo" class="w-10 h-10 object-contain drop-shadow-md" />
        <div>
          <h1 class="text-[#c1d6fb] text-[14px] font-bold leading-tight tracking-wide">THP Portal</h1>
          <p class="text-[#646464] text-[9px] uppercase tracking-widest font-semibold mt-0.5">Admin Kelulusan</p>
        </div>
      </div>

      <nav class="flex-grow px-3 flex flex-col gap-1.5 mt-2">
        <template v-for="(item, index) in menuItems" :key="index">
          <a :href="item.name === 'Dashboard' ? '/admin/dashboard' : (item.name === 'Impor CSV/Excel' ? '/admin/import' : '#')" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-colors"
            :class="item.active ? 'bg-[#1a2b4c] text-[#8ab4f8] shadow-inner' : 'text-[#888] hover:text-white hover:bg-white/5'"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="path" v-for="path in item.icon.split(' u ')" :key="path" />
            </svg>
            {{ item.name }}
          </a>
        </template>
        <a href="/admin/edit" class="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-colors text-[#888] hover:text-white hover:bg-white/5">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Siswa
        </a>
      </nav>

      <div class="p-4 flex flex-col gap-2">
        <a href="/home" @click="() => localStorage.setItem('isAdmin', 'true')" class="flex items-center justify-center gap-2 w-full bg-[#1a2b4c] hover:bg-[#20365d] text-[#8ab4f8] text-[11px] font-bold py-2.5 rounded-lg transition-colors border border-[#2a3b5c]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          Preview User
        </a>
        <div class="bg-[#1f1f1f] hover:bg-[#2a1a1a] rounded-xl p-3 flex items-center justify-center gap-2 border border-white/5 hover:border-red-500/30 shadow-lg mt-1 cursor-pointer transition-colors" @click="logout">
          <span class="text-red-400 font-bold text-xs flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout Admin
          </span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow w-full relative h-[100vh] overflow-y-auto z-10 flex flex-col items-center pt-24 md:pt-12">
      
      <!-- Page Content Layout -->
      <div class="w-full max-w-5xl px-6 md:px-10 pb-12 flex flex-col lg:flex-row items-center lg:items-start gap-8 shrink-0">
        
        <!-- Left Body -->
        <div class="w-full lg:flex-grow flex flex-col">
            
            <div class="mb-8">
              <div class="flex items-center gap-4 mb-2">
                  <button @click="toggleSidebar" class="hidden md:flex bg-[#1f1f1f] border border-[#333] hover:bg-[#2a2a2a] p-2.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  </button>
                  <h2 class="text-white text-3xl font-bold tracking-wide">Pipeline Data Siswa</h2>
              </div>
              <p class="text-[#888] text-sm leading-relaxed max-w-lg">Pemrosesan batch untuk data kelulusan SMK Tunas Harapan Pati. Unggah berkas CSV Anda untuk menyinkronkan direktori digital.</p>
            </div>

            <!-- Upload Dropzone -->
            <div 
                class="bg-[#161616]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-[24px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-[#3a3a3a] transition-all flex flex-col items-center justify-center min-h-[300px] border-dashed cursor-pointer relative group"
                @click="triggerFileInput"
                @dragover="preventDefaults"
                @drop="handleDrop"
            >
                <input type="file" ref="fileInput" @change="handleFileUpload" accept=".csv, .xlsx, .xls" class="hidden" />
                <div class="w-16 h-16 bg-[#202532] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 transition-transform group-hover:scale-105">
                    <svg v-if="!isUploading" class="w-8 h-8 text-[#70a1ff]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <svg v-else class="w-8 h-8 text-[#70a1ff] animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
                <h3 class="text-white text-lg font-bold mb-2">{{ isUploading ? 'Mengunggah Berkas...' : 'Tarik dan lepas berkas CSV/Excel' }}</h3>
                <p class="text-[#646464] text-xs font-medium mb-6">Sinkronkan beberapa kelas kelulusan dalam satu tindakan. Ukuran maksimal berkas: 24MB.</p>
                <button :disabled="isUploading" class="bg-[#6e9fff] hover:bg-[#5b8eff] text-black font-bold py-3.5 px-8 rounded-lg text-xs shadow-lg transition-transform active:scale-95 disabled:opacity-50">
                    {{ isUploading ? 'Memproses...' : 'Telusuri Berkas' }}
                </button>
            </div>

        </div>

        <!-- Right Body: Settings & Specs -->
        <div class="w-full lg:w-[280px] shrink-0 pt-1 flex flex-col gap-5">
            
            <div class="bg-[#181818] border border-[#2a2a2a] rounded-[20px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <h3 class="text-[#888] text-[10px] font-bold tracking-widest uppercase mb-6">Spesifikasi Impor</h3>
                
                <div class="flex flex-col gap-5 text-xs">
                    <div class="flex gap-3">
                        <svg class="w-4 h-4 text-[#4986e7] mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <div class="text-white font-bold mb-1">Enkode UTF-8</div>
                            <div class="text-[#646464] text-[10px] leading-relaxed">Pastikan integritas teks untuk nama siswa.</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <svg class="w-4 h-4 text-[#4986e7] mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <div class="text-white font-bold mb-1">Struktur CSV</div>
                            <div class="text-[#646464] text-[10px] leading-relaxed">Urutan: <br/><strong class="text-[#aaaaaa]">NIS, Nama, Keterangan, Jurusan</strong>.</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <svg class="w-4 h-4 text-[#4986e7] mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <div class="text-white font-bold mb-1">Validasi ID</div>
                            <div class="text-[#646464] text-[10px] leading-relaxed">Nomor NISN harus unik.</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="dismissSuccessModal"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-[#0a0f0d] border border-[#1a2e22] shadow-[0_0_50px_rgba(30,200,100,0.1)] rounded-[24px] p-10 w-full max-w-md flex flex-col items-center text-center transform transition-all scale-100 opacity-100">
            <!-- Close button -->
            <button @click="dismissSuccessModal" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <!-- Check Icon Wrapper -->
            <div class="w-20 h-20 bg-[#122e1b] rounded-[24px] flex items-center justify-center mb-8 border border-[#1a4a2a] shadow-inner">
                <div class="w-10 h-10 bg-[#4ade80] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.4)]">
                    <svg class="w-6 h-6 text-[#062c14]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>
            
            <h2 class="text-white text-2xl font-bold mb-4 tracking-wide">Import Berhasil!</h2>
            <p class="text-[#888] text-sm leading-relaxed mb-10 max-w-[280px]">Data siswa dari file <span class="text-white font-bold">{{ uploadedFileName.toLowerCase().endsWith('.csv') ? 'CSV' : 'Excel' }}</span> telah sukses diunggah ke sistem.</p>
            
            <button @click="dismissSuccessModal" class="w-full bg-gradient-to-r from-[#4f75f9] to-[#3a58d6] hover:from-[#5b80ff] hover:to-[#4060ea] text-white font-bold py-4 rounded-xl text-sm shadow-[0_10px_20px_rgba(79,117,249,0.3)] transition-all active:scale-95">
                Oke
            </button>
        </div>
    </div>
  </div>
</template>
