const fs = require('fs');

const majors = ['TJKT', 'TOI', 'TITL', 'KA', 'DKV', 'BCPF', 'OTO', 'LAS', 'MESIN'];
let csv = 'NIS,NAMA,KETERANGAN,JURUSAN\n';

// 850 data
for(let i = 1; i <= 850; i++) {
  // NIS is 5 numbers like 10001, 10002...
  const nis = String(10000 + i).padStart(5, '0');
  const nama = 'Siswa Tes ' + i;
  const jurusan = majors[i % majors.length];
  // Since everyone passes, populate keterangan with motivation text
  const status = 'Lulus';
  csv += nis + ',' + nama + ',' + status + ',' + jurusan + '\n';
}

fs.writeFileSync('data_siswa_850.csv', csv);
console.log('File data_siswa_850.csv created successfully with 850 records.');
