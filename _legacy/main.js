import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('biodataForm');
  const submitBtn = document.getElementById('submitBtn');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  // Tab Elements
  const tabForm = document.getElementById('tabForm');
  const tabData = document.getElementById('tabData');
  const viewForm = document.getElementById('viewForm');
  const viewData = document.getElementById('viewData');
  const dataTableBody = document.getElementById('dataTableBody');
  const emptyState = document.getElementById('emptyState');
  const tableContainer = document.querySelector('.table-container');

  // URL Google Apps Script yang nantinya akan diisi
  const SCRIPT_URL = ''; // TODO: Ganti dengan URL deployment Google Apps Script Anda

  // Local state untuk menyimpan data sementara
  let databaseSiswa = [];

  // Logic untuk pindah tab
  tabForm.addEventListener('click', () => {
    tabForm.classList.add('active');
    tabData.classList.remove('active');
    viewForm.classList.remove('hidden');
    viewData.classList.add('hidden');
  });

  tabData.addEventListener('click', async () => {
    tabData.classList.add('active');
    tabForm.classList.remove('active');
    viewData.classList.remove('hidden');
    viewForm.classList.add('hidden');
    
    // Ambil data terbaru dari Google Sheets jika URL tersedia
    await fetchDatabase();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Sembunyikan notifikasi sebelumnya
    hideNotification();

    // Kumpulkan data form
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Tampilkan state loading di tombol
    submitBtn.classList.add('loading');

    try {
      if (!SCRIPT_URL) {
        // Simulasi jika belum ada URL Apps Script
        await new Promise(resolve => setTimeout(resolve, 1500));
        databaseSiswa.push(data);
        showNotification('Data disimpan lokal. Segera masukkan SCRIPT_URL di main.js!', 'success');
        form.reset();
      } else {
        // Mengirim data ke Google Apps Script menggunakan query parameters (cocok dengan doPost sederhana)
        const queryString = new URLSearchParams(data).toString();
        const response = await fetch(`${SCRIPT_URL}?${queryString}`, {
          method: 'POST',
        });

        if (response.ok) {
          showNotification('Data berhasil dikirim ke Google Sheets!', 'success');
          form.reset();
          // Update data lokal setelah kirim sukses
          await fetchDatabase();
        } else {
          throw new Error('Gagal terhubung ke Apps Script');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Gagal mengirim data. Pastikan URL benar dan CORS diizinkan.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
    }
  });

  async function fetchDatabase() {
    if (!SCRIPT_URL) {
      renderTable(); // Tampilkan data lokal jika tidak ada URL
      return;
    }

    // Tampilkan state loading di tabel
    dataTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 40px;">Mengambil data dari Google Sheets...</td></tr>';
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';

    try {
      const response = await fetch(SCRIPT_URL);
      if (response.ok) {
        const data = await response.json();
        databaseSiswa = data;
        renderTable();
      } else {
        throw new Error('Gagal mengambil data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Jika gagal fetch (CORS atau URL salah), tampilkan yang lokal saja
      renderTable();
    }
  }

  function renderTable() {
    dataTableBody.innerHTML = '';
    
    if (databaseSiswa.length === 0) {
      tableContainer.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      tableContainer.style.display = 'block';
      emptyState.style.display = 'none';
      
      databaseSiswa.forEach(siswa => {
        const row = document.createElement('tr');
        // Format tanggal jika perlu (Opsional)
        let displayDate = siswa.tanggalLahir;
        try {
          if (displayDate) {
            const d = new Date(displayDate);
            if (!isNaN(d)) displayDate = d.toLocaleDateString('id-ID');
          }
        } catch(e) {}

        row.innerHTML = `
          <td>${siswa.namaLengkap || '-'}</td>
          <td>${siswa.nisn || '-'}</td>
          <td>${siswa.jenisKelamin || '-'}</td>
          <td>${displayDate || '-'}</td>
        `;
        dataTableBody.appendChild(row);
      });
    }
  }


  function showNotification(message, type) {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    
    // Auto sembunyikan setelah 5 detik
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  function hideNotification() {
    notification.className = 'notification hidden';
  }
});

