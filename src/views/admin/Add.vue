<script setup>
import { ref } from 'vue'
import api from '../../API/index.js'

const menuItems = [
  { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: false },
  { name: 'Impor CSV/Excel', icon: 'M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: false }
]

const majors = [
    { id: 'TJKT', name: 'Teknik Jaringan Komputer dan Telekomunikasi', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'TOI', name: 'Teknik Otomasi Industri', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z u M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'TITL', name: 'Teknik Instalasi Tenaga Listrik', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'KA', name: 'Kimia Analisis', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'DKV', name: 'Desain Komunikasi Visual', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z u M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { id: 'BCPF', name: 'Broadcasting dan Perfilman', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'OTO', name: 'Teknik Otomotif', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'LAS', name: 'Teknik Las', icon: 'M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z' },
    { id: 'MESIN', name: 'Teknik Mesin', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }
]

const form = ref({
   nis: '',
   nama: '',
   keterangan: 'Lulus',
   jurusan: 'TJKT' // default selected
})

const isSubmitting = ref(false)
const errorMsg = ref('')
const showSuccessModal = ref(false)
const isSidebarOpen = ref(window.innerWidth >= 768)

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value

const dismissSuccessModal = () => {
    showSuccessModal.value = false
    window.location.href = '/admin/dashboard'
}

const submitForm = async () => {
    if (!form.value.nis || !form.value.nama) {
        alert("NIS dan Nama harus diisi!")
        return
    }
    
    isSubmitting.value = true
    errorMsg.value = ''
    try {
        const res = await api.post('/api/admin/students', {
            nis: form.value.nis,
            nama: form.value.nama,
            keterangan: form.value.keterangan,
            jurusan: form.value.jurusan
        })
        
        if (res.status === 200 || res.status === 201) {
            showSuccessModal.value = true
        } else {
            alert("Gagal: Terjadi kesalahan")
        }
    } catch (e) {
        console.error(e)
        alert("Gagal menghubungi server. Pastikan backend menyala.")
    } finally {
        isSubmitting.value = false
    }
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

        <a href="/admin/edit" class="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-colors bg-[#1a2b4c] text-[#8ab4f8] shadow-inner mt-1">
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
    <main class="flex-grow w-full relative h-[100vh] overflow-y-auto z-10 flex flex-col items-center pt-24 md:pt-10">

      <!-- Toggle Switch for Data Action -->
      <div class="w-full max-w-6xl px-6 md:px-10 flex justify-center md:justify-end mb-4 shrink-0">
        <div class="bg-[#1f1f1f] p-1 rounded-full flex border border-white/5 shadow-inner">
          <a href="/admin/edit" class="px-6 py-2 rounded-full text-xs font-bold transition-all text-[#777] hover:text-white">
            Update Data
          </a>
          <a href="/admin/tambah" class="px-6 py-2 rounded-full text-xs font-bold transition-all bg-[#303030] text-blue-400 shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            Tambah Data
          </a>
        </div>
      </div>

      <!-- Page Content Layout -->
      <div class="w-full max-w-5xl px-6 md:px-10 pb-12 flex flex-col lg:flex-row items-center lg:items-start gap-8 shrink-0">
        
        <!-- Left Body: Form Section -->
        <div class="w-full lg:flex-grow flex flex-col pt-2">
            
            <div class="flex items-center gap-4 mb-2">
                <button @click="toggleSidebar" class="hidden md:flex bg-[#1f1f1f] border border-[#333] hover:bg-[#2a2a2a] p-2.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <h2 class="text-white text-3xl font-bold tracking-wide">Tambah Data Siswa</h2>
            </div>
            <p class="text-[#777] text-xs leading-relaxed font-medium mb-8 max-w-lg">Masukkan informasi siswa untuk mengisi database kelulusan SMK Tunas Harapan Pati. Pastikan identitas akademik akurat untuk proses sertifikasi.</p>

            <div class="flex flex-col gap-10">
                <!-- IDENTITAS SISWA -->
                <div>
                    <h3 class="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 mb-5 border-l-2 border-[#4986e7] pl-3">
                        Identitas Siswa
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4">
                        <div>
                            <label class="block text-[#666] text-[9px] uppercase font-bold tracking-widest mb-2">Nomor Induk Siswa (NIS)</label>
                            <input type="text" v-model="form.nis" placeholder="Masukkan NIS" class="w-full bg-[#1a1a1a] text-gray-300 placeholder-[#444] border border-[#2a2a2a] font-medium py-3.5 px-4 rounded-xl outline-none focus:border-[#4986e7]/50 shadow-inner text-xs" />
                        </div>
                        <div>
                            <label class="block text-[#666] text-[9px] uppercase font-bold tracking-widest mb-2">Nama Lengkap</label>
                            <input type="text" v-model="form.nama" placeholder="Masukkan Nama Sesuai Dengan Dokumen Resmi" class="w-full bg-[#1a1a1a] text-gray-300 placeholder-[#444] border border-[#2a2a2a] font-medium py-3.5 px-4 rounded-xl outline-none focus:border-[#4986e7]/50 shadow-inner text-xs" />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-[#666] text-[9px] uppercase font-bold tracking-widest mb-2">Status Kelulusan</label>
                            <select v-model="form.keterangan" class="w-full bg-[#1a1a1a] text-gray-300 placeholder-[#444] border border-[#2a2a2a] font-medium py-3.5 px-4 rounded-xl outline-none focus:border-[#4986e7]/50 shadow-inner text-xs appearance-none">
                                <option value="Lulus">Lulus</option>
                                <option value="TidakLulus">Tidak Lulus</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- JURUSAN AKADEMIK -->
                <div>
                    <h3 class="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 mb-5 border-l-2 border-[#4986e7] pl-3">
                        Jurusan Akademik
                    </h3>
                    
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                        <!-- Selectable Cards using label wrapper -->
                        <label v-for="major in majors" :key="major.id" class="cursor-pointer">
                            <input type="radio" :value="major.id" v-model="form.jurusan" class="hidden peer" />
                            <div class="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#4986e7]/60 hover:bg-[#1c222b] hover:-translate-y-1 hover:shadow-lg rounded-xl p-4 transition-all duration-300 peer-checked:bg-[#1f2b3f] peer-checked:border-[#4986e7] peer-checked:shadow-[0_0_15px_rgba(73,134,231,0.2)] h-[105px] flex flex-col justify-center">
                                <svg class="w-5 h-5 mb-2 transition-colors" :class="form.jurusan === major.id ? 'text-[#70a1ff]' : 'text-[#555]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path" v-for="path in major.icon.split(' u ')" :key="path" />
                                </svg>
                                <span class="text-xs font-bold line-clamp-2 leading-tight" :class="form.jurusan === major.id ? 'text-white' : 'text-gray-400'">{{ major.name }}</span>
                                <span class="text-[9px] mt-1 tracking-widest block font-medium" :class="form.jurusan === major.id ? 'text-[#6e9eff]' : 'text-[#444]'">JURUSAN {{ major.id }}</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Submit Action -->
                <div class="flex items-center justify-center mt-6">
                    <button type="button" @click="submitForm" :disabled="isSubmitting" class="bg-[#1a56db] hover:bg-[#1e4ebd] text-white font-bold py-3.5 px-10 rounded-lg text-[11px] uppercase tracking-wider shadow-[0_10px_30px_rgba(26,86,219,0.5)] transition-transform active:scale-95 text-center disabled:opacity-50">
                        {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Right Body: Widgets -->
        <div class="w-full lg:w-[300px] shrink-0 pt-2 flex flex-col gap-6">
            


            <!-- Panduan Widget -->
            <div class="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <div class="flex items-center gap-2 mb-6 text-white font-bold text-sm tracking-wide">
                    <svg class="w-4 h-4 text-[#4986e7]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Panduan Pengisian
                </div>

                <div class="flex flex-col gap-5">
                    <div class="flex gap-4 items-start">
                        <span class="text-[#4986e7] text-[10px] font-bold bg-[#1a253a] px-1.5 py-0.5 rounded border border-[#2a3a5a] mt-0.5 font-mono">01</span>
                        <p class="text-[#888] text-[11px] leading-relaxed">Pastikan NIS sesuai dengan catatan buku induk resmi sekolah.</p>
                    </div>
                    <div class="flex gap-4 items-start">
                        <span class="text-[#4986e7] text-[10px] font-bold bg-[#1a253a] px-1.5 py-0.5 rounded border border-[#2a3a5a] mt-0.5 font-mono">02</span>
                        <p class="text-[#888] text-[11px] leading-relaxed">Nama lengkap harus diketik dalam format Title Case tanpa singkatan.</p>
                    </div>
                    <div class="flex gap-4 items-start">
                        <span class="text-[#4986e7] text-[10px] font-bold bg-[#1a253a] px-1.5 py-0.5 rounded border border-[#2a3a5a] mt-0.5 font-mono">03</span>
                        <p class="text-[#888] text-[11px] leading-relaxed">Perubahan Jurusan memerlukan otorisasi admin setelah data disimpan.</p>
                    </div>
                </div>
            </div>

            <!-- Image Card Widget -->
            <div class="border border-[#333] rounded-xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.7)] h-[240px] mt-2 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/images/Desktop.jpeg" class="w-full h-full object-cover opacity-60" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4">
                    <span class="text-white/60 text-[9px] uppercase tracking-widest font-bold mb-0.5">SMK TUNAS HARAPAN PATI</span>
                    <span class="text-white text-xs font-bold">Persiapan Angkatan 2026</span>
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
            
            <h2 class="text-white text-2xl font-bold mb-4 tracking-wide">Data Berhasil Ditambah!</h2>
            <p class="text-[#888] text-sm leading-relaxed mb-10 max-w-[280px]">Data siswa baru telah sukses disimpan ke Dashboard.</p>
            
            <button @click="dismissSuccessModal" class="w-full bg-gradient-to-r from-[#4f75f9] to-[#3a58d6] hover:from-[#5b80ff] hover:to-[#4060ea] text-white font-bold py-4 rounded-xl text-sm shadow-[0_10px_20px_rgba(79,117,249,0.3)] transition-all active:scale-95">
                Oke
            </button>
        </div>
    </div>
  </div>
</template>
