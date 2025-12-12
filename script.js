const dataInput = document.getElementById('dataInput');
const saveButton = document.getElementById('saveButton');
const dataList = document.getElementById('dataList');
const dataId = document.getElementById('dataId');

// --- Helper: Ambil semua data dari Local Storage ---
function getData() {
    const dataString = localStorage.getItem('crudData');
    return dataString ? JSON.parse(dataString) : [];
}

// --- Helper: Simpan data ke Local Storage ---
function saveData(data) {
    localStorage.setItem('crudData', JSON.stringify(data));
}

// --- READ: Menampilkan semua data ---
function renderData() {
    const dataArray = getData();
    dataList.innerHTML = ''; // Kosongkan daftar

    if (dataArray.length === 0) {
        dataList.innerHTML = '<li>Belum ada data.</li>';
        return;
    }

    dataArray.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>ID: ${item.id} | ${item.name}</span>
            <button onclick="editData(${item.id}, '${item.name}')">Ubah</button>
            <button onclick="deleteData(${item.id})">Hapus</button>
        `;
        dataList.appendChild(li);
    });
}

// --- CREATE & UPDATE ---
saveButton.addEventListener('click', () => {
    const name = dataInput.value.trim();
    if (name === '') return;

    let dataArray = getData();
    const currentId = dataId.value;

    if (currentId) {
        // UPDATE
        dataArray = dataArray.map(item =>
            item.id == currentId ? { ...item, name: name } : item
        );
        saveButton.textContent = 'Tambah Data (Create)'; // Kembalikan teks tombol
        dataId.value = ''; // Kosongkan ID tersembunyi
    } else {
        // CREATE
        const newId = dataArray.length > 0 ? Math.max(...dataArray.map(d => d.id)) + 1 : 1;
        dataArray.push({ id: newId, name: name });
    }

    saveData(dataArray);
    dataInput.value = ''; // Kosongkan input
    renderData();
});

// --- UPDATE (Logika persiapan) ---
window.editData = function(id, name) {
    dataInput.value = name; // Isi form dengan data lama
    dataId.value = id; // Simpan ID data yang akan diubah
    saveButton.textContent = 'Simpan Perubahan (Update)';
    dataInput.focus();
}

// --- DELETE ---
window.deleteData = function(id) {
    if (confirm('Yakin ingin menghapus data ini?')) {
        let dataArray = getData();
        dataArray = dataArray.filter(item => item.id !== id);
        saveData(dataArray);
        renderData();
    }
}

// Muat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderData);