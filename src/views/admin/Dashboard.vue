<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '../../API/index.js'

const totalLulusan = ref(0)
const students = ref([])
const isSidebarOpen = ref(window.innerWidth >= 768)

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value

const currentPage = ref(1)
const itemsPerPage = 10

const selectedJurusan = ref('Semua Jurusan')
const searchQuery = ref('')

// Announcement state
const announcement = ref({
    countdown: '',
    information: '',
    is_open: false
})
const isSavingAnnouncement = ref(false)

const saveAnnouncement = async () => {
    isSavingAnnouncement.value = true
    try {
        await api.put('/api/admin/announcement', announcement.value)
        alert('Pengaturan pengumuman berhasil disimpan!')
    } catch (e) {
        console.error(e)
        alert('Gagal menyimpan pengaturan pengumuman')
    } finally {
        isSavingAnnouncement.value = false
    }
}

const filteredStudents = computed(() => {
    let filtered = students.value;
    if (selectedJurusan.value !== 'Semua Jurusan') {
        filtered = filtered.filter(s => s.jurusanCode === selectedJurusan.value);
    }
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(s => (s.name || '').toLowerCase().includes(q) || String(s.nis).toLowerCase().includes(q));
    }
    return filtered.slice().sort((a, b) => {
        return String(a.nis).localeCompare(String(b.nis), undefined, { numeric: true })
    });
})

watch([selectedJurusan, searchQuery], () => {
    currentPage.value = 1;
})

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredStudents.value.slice(start, start + itemsPerPage);
})

const totalPages = computed(() => {
    return Math.ceil(filteredStudents.value.length / itemsPerPage);
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

const normalizeJurusanCode = (j) => {
    if (!j) return '';
    const upper = j.trim().toUpperCase();
    if (jurusanMap[upper]) return upper;
    if (upper.includes('JARINGAN') || upper === 'TKJ') return 'TJKT';
    if (upper.includes('OTOMASI')) return 'TOI';
    if (upper.includes('LISTRIK')) return 'TITL';
    if (upper.includes('KIMIA')) return 'KA';
    if (upper.includes('VISUAL')) return 'DKV';
    if (upper.includes('BROADCASTING')) return 'BCPF';
    if (upper.includes('OTOMOTIF')) return 'OTO';
    if (upper.includes('LAS') || upper.includes('PENGELASAN')) return 'LAS';
    if (upper.includes('MESIN') || upper.includes('PEMESINAN')) return 'MESIN';
    return upper;
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

const showDeleteConfirm = ref(false);
const studentToDelete = ref(null);
const isDeleting = ref(false);

const confirmDelete = (student) => {
    studentToDelete.value = student;
    showDeleteConfirm.value = true;
};

const cancelDelete = () => {
    showDeleteConfirm.value = false;
    studentToDelete.value = null;
};

const executeDelete = async () => {
    if (!studentToDelete.value) return;
    isDeleting.value = true;
    try {
        const res = await api.delete(`/api/admin/students/${studentToDelete.value.nis}`);
        if (res.status === 200 || res.data) {
            students.value = students.value.filter(s => s.nis !== studentToDelete.value.nis);
            totalLulusan.value--;
            showDeleteConfirm.value = false;
        } else {
            alert('Gagal menghapus data');
        }
    } catch (e) {
        console.error(e);
        alert('Kesalahan jaringan');
    } finally {
        isDeleting.value = false;
        studentToDelete.value = null;
    }
};

const exportExcel = async () => {
    try {
        const res = await api.get('/api/admin/students/export-excel', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Data_Siswa.xlsx');
        document.body.appendChild(link);
        link.click();
    } catch (e) {
        console.error(e);
        alert("Gagal mengekspor data Excel");
    }
}

const exportCSV = async () => {
    try {
        const res = await api.get('/api/admin/students/export-csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Data_Siswa.csv');
        document.body.appendChild(link);
        link.click();
    } catch (e) {
        console.error(e);
        alert("Gagal mengekspor data CSV");
    }
}

onMounted(async () => {
    try {
       const resCount = await api.get(`/api/admin/students/count`)
       if (resCount.data) {
           totalLulusan.value = resCount.data.total
       }
       
       const resList = await api.get(`/api/admin/students`)
       if (resList.data) {
           students.value = resList.data.map(s => {
               const code = normalizeJurusanCode(s.jurusan);
               return {
                   nis: s.nis,
                   name: s.nama_siswa,
                   initial: s.nama_siswa ? s.nama_siswa.substring(0, 2).toUpperCase() : 'NN',
                   jurusanCode: code,
                   jurusan: jurusanMap[code] || s.jurusan,
                   status: s.keterangan || 'Menunggu',
                   scode: s.keterangan ? 'green' : 'gray'
               }
           })
       }

       const resAnn = await api.get(`/api/admin/announcement`)
       if (resAnn.data && resAnn.data.data) {
           const d = resAnn.data.data
           if (d.countdown) {
               const dt = new Date(d.countdown)
               dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
               announcement.value.countdown = dt.toISOString().slice(0,16)
           }
           announcement.value.information = d.information
           announcement.value.is_open = d.is_open
       }
   } catch (e) {
       console.error(e)
   }
})

const menuItems = [
  { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: true },
  { name: 'Impor CSV/Excel', icon: 'M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: false }
]

const logout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('token')
    window.location.href = '/admin/login'
}
</script>

<template>
  <div class="min-h-screen w-full flex bg-[#0a0a0a] font-sans">
    
    <!-- Background image spanning under content -->
    <div class="fixed inset-0 bg-[url('/images/Mobile.jpeg')] md:bg-[url('/images/Desktop.jpeg')] bg-cover bg-center opacity-[0.15] mix-blend-screen pointer-events-none"></div>

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
    <main class="flex-grow w-full relative h-screen overflow-y-auto pt-24 md:pt-10">
      
      <!-- Page Content -->
      <div class="px-6 md:px-10 pb-10">
        
        <!-- Page Title Area -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div class="flex items-center gap-4">
            <button @click="toggleSidebar" class="hidden md:flex bg-[#1f1f1f] border border-[#333] hover:bg-[#2a2a2a] p-2.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div>
              <h2 class="text-white text-3xl md:text-4xl font-bold mb-2 tracking-wide">Portal Manajemen</h2>
              <p class="text-[#8e8e8e] text-[12px] md:text-[13px] leading-relaxed max-w-lg font-medium">Sistem administrasi kelulusan SMK Tunas Harapan Pati. Kelola arsip siswa dan status kelulusan.</p>
            </div>
          </div>
          <div class="flex items-center gap-4 mt-2">
            <a href="/admin/edit" class="bg-gradient-to-r from-[#1a56db] to-[#1e4ebd] hover:from-[#1e4ebd] hover:to-[#2257d1] text-white text-xs font-bold py-3 px-8 rounded-full shadow-[0_10px_30px_rgba(26,86,219,0.3)] transition-transform active:scale-95 inline-block">
              Edit Data Siswa
            </a>
          </div>
        </div>

        <!-- Announcement Settings Top Block -->
        <div class="mb-8 md:mb-12 bg-[#1a1a1a]/90 backdrop-blur-md rounded-[20px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/5">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 class="text-white font-bold text-lg tracking-wide">Pengaturan Pengumuman & Countdown</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1">
              <label class="block text-[#a0a0a0] text-[10px] font-semibold mb-2 tracking-wide uppercase">Waktu Countdown</label>
              <input v-model="announcement.countdown" type="datetime-local" class="w-full bg-[#272727] text-[#e0e0e0] text-xs font-medium py-3 px-4 rounded-lg outline-none border border-white/5 focus:border-green-500 transition-colors cursor-pointer" />
              
              <label class="block text-[#a0a0a0] text-[10px] font-semibold mt-4 mb-2 tracking-wide uppercase">Status Pengumuman (Dibuka/Ditutup)</label>
              <div class="flex items-center gap-3 mt-2">
                <input type="checkbox" v-model="announcement.is_open" id="isOpen" class="w-4 h-4 rounded text-green-500 bg-[#272727] border-none focus:ring-0 cursor-pointer" />
                <label for="isOpen" class="text-white text-xs cursor-pointer select-none">Buka Akses Pengumuman Hasil Kelulusan</label>
              </div>

              <button @click="saveAnnouncement" :disabled="isSavingAnnouncement" class="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xs font-bold py-3 px-8 rounded-lg shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {{ isSavingAnnouncement ? 'Menyimpan...' : 'Simpan Pengaturan' }}
              </button>
            </div>
            
            <div class="md:col-span-2 flex flex-col h-full">
              <label class="block text-[#a0a0a0] text-[10px] font-semibold mb-2 tracking-wide uppercase">Pesan Informasi Kelulusan (Tampil di Halaman Hasil)</label>
              <textarea v-model="announcement.information" class="w-full flex-grow bg-[#272727] text-[#e0e0e0] text-xs font-medium p-4 rounded-lg outline-none border border-white/5 focus:border-green-500 transition-colors resize-none h-[150px] md:h-full" placeholder="Peserta didik yang budiman, kelulusan ini bukanlah akhir..."></textarea>
            </div>
          </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="flex flex-col xl:flex-row gap-8 items-start">
          
          <!-- Left Column (Filters & Stats)  -->
          <div class="w-full xl:w-64 shrink-0 flex flex-col gap-8">
            
            <!-- Filters -->
            <div>
              <h3 class="text-[#646464] text-[10px] font-bold uppercase tracking-widest mb-4">Filter Cepat</h3>
              
              <div class="mb-5">
                <label class="block text-[#a0a0a0] text-[10px] font-semibold mb-2 tracking-wide uppercase">Jurusan</label>
                <div class="relative">
                  <select v-model="selectedJurusan" class="w-full bg-[#272727] text-[#e0e0e0] text-xs font-medium py-3 px-4 rounded-lg appearance-none outline-none border border-white/5 cursor-pointer hover:bg-[#303030] transition-colors">
                    <option value="Semua Jurusan">Semua Jurusan</option>
                    <option value="TJKT">TJKT</option>
                    <option value="TOI">TOI</option>
                    <option value="TITL">TITL</option>
                    <option value="KA">KA</option>
                    <option value="DKV">DKV</option>
                    <option value="BCPF">BCPF</option>
                    <option value="OTO">OTO</option>
                    <option value="LAS">LAS</option>
                    <option value="MESIN">MESIN</option>
                  </select>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <!-- Search by Name/NIS -->
              <div class="mb-5">
                <label class="block text-[#a0a0a0] text-[10px] font-semibold mb-2 tracking-wide uppercase">Cari Nama / NIS</label>
                <div class="relative">
                  <input v-model="searchQuery" type="text" placeholder="Masukkan nama atau NIS..." class="w-full bg-[#1e1e1e] focus:bg-[#272727] text-[#e0e0e0] text-xs font-medium py-3 px-4 pl-10 rounded-lg appearance-none outline-none border border-white/5 focus:border-[#4a5f8e] transition-colors" />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>

              <!-- Angkatan Kelulusan Removed -->
            </div>

            <!-- Stats Card -->
            <div>
              <h3 class="text-[#646464] text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                Statistik Langsung <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              </h3>
              <div class="bg-gradient-to-br from-[#1a1a1a] to-[#242424] p-6 rounded-2xl shadow-lg border border-[#333]">
                <p class="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  {{ selectedJurusan === 'Semua Jurusan' && !searchQuery ? 'Total Lulusan' : 'Jumlah Ditemukan' }}
                </p>
                <div class="text-white text-5xl font-bold tracking-tight">{{ filteredStudents.length }}</div>
                <div class="mt-4 w-1/2 h-0.5" :class="selectedJurusan !== 'Semua Jurusan' || searchQuery ? 'bg-gradient-to-r from-green-500 to-green-900' : 'bg-gradient-to-r from-blue-500 to-blue-900'"></div>
              </div>
            </div>

          </div>

          <!-- Right Column (Table) -->
          <div class="flex-grow bg-[#1a1a1a]/90 backdrop-blur-md rounded-[20px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/5">
            
            <!-- Table Header -->
            <div class="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h3 class="text-white font-bold text-lg tracking-wide">Direktori Siswa</h3>
              </div>
              
              <div class="flex gap-3">
                <button @click="exportCSV" class="bg-[#1f2937] hover:bg-[#374151] border border-gray-600 text-gray-300 text-[10px] font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shrink-0">
                  <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Export CSV
                </button>
                <button @click="exportExcel" class="bg-[#1f2937] hover:bg-[#374151] border border-gray-600 text-gray-300 text-[10px] font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shrink-0">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Export Excel
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="w-full overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#3a3a3a]">
                    <th class="py-4 text-[#8e8e8e] font-semibold text-[10px] uppercase tracking-wider min-w-[80px]">NIS</th>
                    <th class="py-4 text-[#8e8e8e] font-semibold text-[10px] uppercase tracking-wider min-w-[180px]">NAMA LENGKAP</th>
                    <th class="py-4 text-[#8e8e8e] font-semibold text-[10px] uppercase tracking-wider min-w-[150px]">JURUSAN</th>
                    <th class="py-4 text-[#8e8e8e] font-semibold text-[10px] uppercase tracking-wider min-w-[120px]">STATUS</th>
                    <th class="py-4 text-[#8e8e8e] font-semibold text-[10px] uppercase tracking-wider text-right min-w-[80px]">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in paginatedStudents" :key="index" class="border-b border-[#3a3a3a] hover:bg-white/[0.02] transition-colors group">
                    <td class="py-5 font-bold text-[#4986e7] text-xs font-mono tracking-wider">{{ student.nis }}</td>
                    <td class="py-5">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-[#333] text-gray-300 flex items-center justify-center text-[10px] font-bold border border-white/5 shadow-inner">
                          {{ student.initial }}
                        </div>
                        <span class="text-gray-200 text-sm font-semibold tracking-wide">{{ student.name }}</span>
                      </div>
                    </td>
                    <td class="py-5">
                      <span class="bg-[#383838] text-gray-300 text-[10px] px-3 py-1.5 rounded-full font-medium border border-white/5 truncate max-w-[150px] inline-block align-bottom">
                        {{ student.jurusan }}
                      </span>
                    </td>
                    <td class="py-5">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full shrink-0" 
                              :class="{'bg-green-500': student.scode === 'green', 'bg-gray-500': student.scode === 'gray', 'bg-red-500': student.scode === 'red'}">
                        </span>
                        <span class="text-gray-400 text-[10px] font-semibold tracking-wide truncate max-w-[150px] inline-block align-middle" :title="student.status">{{ student.status }}</span>
                      </div>
                    </td>
                    <td class="py-5 text-right opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="confirmDelete(student)" class="text-gray-400 hover:text-red-500 p-2 bg-[#1a1a1a] rounded-lg border border-white/5 shadow-sm hover:border-red-500/30 transition-all inline-flex items-center justify-center mr-2" title="Hapus Data Siswa">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Footer / Pagination -->
            <div class="mt-8 flex justify-between items-center text-xs">
              <div class="text-[#7a7a7a]">Menampilkan {{ filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}-{{ Math.min(currentPage * itemsPerPage, filteredStudents.length) }} dari {{ filteredStudents.length }} siswa</div>
              <div class="flex gap-2">
                <button @click="prevPage" :disabled="currentPage === 1" class="w-8 h-8 rounded-lg bg-[#2d2d2d] hover:bg-[#383838] text-gray-400 flex items-center justify-center transition-colors border border-white/5 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button class="px-4 h-8 rounded-lg bg-[#a9c2fa] text-[#1a56db] font-bold flex items-center justify-center shadow-md">
                  {{ currentPage }} / {{ totalPages || 1 }}
                </button>
                <button @click="nextPage" :disabled="currentPage >= totalPages" class="w-8 h-8 rounded-lg bg-[#2d2d2d] hover:bg-[#383838] text-gray-400 flex items-center justify-center transition-colors border border-white/5 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </main>

    <!-- Floating Action Button Removed as requested -->

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cancelDelete"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-[#0a0f0d] border border-[#2e1a1a] shadow-[0_0_50px_rgba(200,30,30,0.1)] rounded-[24px] p-10 w-full max-w-md flex flex-col items-center text-center transform transition-all scale-100 opacity-100">
            <!-- Close button -->
            <button @click="cancelDelete" :disabled="isDeleting" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <!-- Icon Wrapper -->
            <div class="w-20 h-20 bg-[#2e1212] rounded-[24px] flex items-center justify-center mb-6 border border-[#4a1a1a] shadow-inner">
                <div class="w-10 h-10 bg-[#ef4444] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <svg class="w-5 h-5 text-[#3b0909]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
            </div>
            
            <h2 class="text-white text-2xl font-bold mb-3 tracking-wide">Hapus Data?</h2>
            <p class="text-[#888] text-sm leading-relaxed mb-8 max-w-[280px]">
                Apakah Anda yakin ingin menghapus 
                <span class="text-white font-bold">{{ studentToDelete?.name }}</span>? 
                Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div class="flex gap-4 w-full">
                <button @click="cancelDelete" :disabled="isDeleting" class="flex-1 bg-[#242424] hover:bg-[#333] text-gray-300 font-bold py-3.5 rounded-xl text-sm transition-colors border border-[#3a3a3a]">
                    Batal
                </button>
                <button @click="executeDelete" :disabled="isDeleting" class="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#f87171] hover:to-[#ef4444] text-white font-bold py-3.5 rounded-xl text-sm shadow-[0_10px_20px_rgba(239,68,68,0.3)] transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    <svg v-if="isDeleting" class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span>
                </button>
            </div>
        </div>
    </div>

  </div>
</template>
