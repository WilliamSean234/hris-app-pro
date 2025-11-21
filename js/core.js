// js/core.js (Logika Utama Aplikasi - VERSI LENGKAP)

let currentEmployeeIndex = null;
let currentEmployeeDetail = null; // Menyimpan data karyawan yang sedang dilihat
let currentApprovalRecord = null; // Menyimpan data approval yang sedang ditinjau

// let pageLoadContext = {}; // Konteks untuk memuat data saat pindah halaman (Detail Karyawan)
const pageLoadContext = { employeeIndex: undefined, month: null, view: null };

// --- PAGE LOADER ---
function loadPage(pageId) {
    const contentArea = document.getElementById('page-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1. Update active class di sidebar
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });

    // Jika halaman detail dimuat, pastikan Core HR tetap aktif
    if (pageId === 'employee-detail') {
        // Temukan link Core HR berdasarkan data-page="core-hr"
        const coreHrLink = document.querySelector('.nav-link[data-page="core-hr"]');
        if (coreHrLink) {
            coreHrLink.classList.add('active');
        }
    }

    // 2. Load content
    fetch(`pages/${pageId}.html`)
        .then(response => {
            if (!response.ok) {
                // Memberikan pesan error yang lebih jelas (seperti yang terlihat pada gambar)
                throw new Error(`Failed to fetch pages/${pageId}.html`);
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            initializePage(pageId); // Panggil fungsi inisialisasi
        })
        .catch(error => {
            contentArea.innerHTML = `<div class="card wide-card"><p class="text-danger">Error: ${error.message}. Cek apakah file pages/${pageId}.html ada.</p></div>`;
            console.error(error);
        });
}

// function initializePage(pageId) {
//     if (pageId === 'dashboard') {
//         updateDashboardMetrics(); 
//     } else if (pageId === 'core-hr') {
//         filterAndRenderEmployees(); // Render list saat halaman Core HR dimuat
//     } else if (pageId === 'employee-detail') { // LOGIKA BARU UNTUK DETAIL
//         if (pageLoadContext.employeeIndex !== undefined) {
//             const index = pageLoadContext.employeeIndex;
//             const emp = employees[index];
//             currentEmployeeDetail = emp;
//             currentEmployeeIndex = index;

//             document.getElementById('detail-name').textContent = `Detail Karyawan: ${emp.name} (${emp.nik})`;
//             changeDetailTab('personal'); // Muat tab Data Pribadi awal
//         } else {
//             document.getElementById('page-content').innerHTML = `<div class="card wide-card"><p class="text-danger">Error: ID Karyawan tidak ditemukan.</p><button class="btn btn-secondary" onclick="loadPage('core-hr')">Kembali ke Daftar</button></div>`;
//         }
//     }
//     else if (pageId === 'attendance') {
//         renderAttendanceRekap();
//         renderLeaveRequests();
//         renderLeaveBalances();
//         renderApprovalRecords();
//         // Set tab Approval sebagai default aktif
//         changeAttendanceTab(null, 'approval'); 
//     } else if (pageId === 'payroll') { 
//         renderPayrollRekap(); 
//     }
// }

// js/core.js - Perbaikan initializePage

function initializePage(pageId) {
    if (pageId === 'dashboard') {
        updateDashboardMetrics();
    } else if (pageId === 'core-hr') {
        filterAndRenderEmployees(); // Render list saat halaman Core HR dimuat
    } else if (pageId === 'employee-detail') {
        if (pageLoadContext.employeeIndex !== undefined) {
            const index = pageLoadContext.employeeIndex;
            const emp = employees[index];
            currentEmployeeDetail = emp;
            currentEmployeeIndex = index;

            document.getElementById('detail-name').textContent = `Detail Karyawan: ${emp.name} (${emp.nik})`;
            changeDetailTab('personal'); // Muat tab Data Pribadi awal
        } else {
            document.getElementById('page-content').innerHTML = `<div class="card wide-card"><p class="text-danger">Error: ID Karyawan tidak ditemukan.</p><button class="btn btn-secondary" onclick="loadPage('core-hr')">Kembali ke Daftar</button></div>`;
        }
    }
    else if (pageId === 'attendance') {
        // --- PERBAIKAN DI SINI ---
        renderAttendanceRekap();
        renderLeaveRequests();
        renderLeaveBalances();
        renderApprovalRecords();

        // Panggil inisialisasi tab
        // Kita paksa klik tombol Pengajuan Cuti (Approval)
        const defaultButton = document.querySelector('.tabs-nav .tab-button'); // Ambil tombol pertama
        if (defaultButton) {
            // Panggil fungsi switchTab/changeAttendanceTab dengan parameter konten pertama
            switchTab('leave', 'leave-requests-content', defaultButton);
        }
    }
    // 5. Logic Payroll Simulation (FINAL)

    // else if (pageId === 'payroll') {
    //     let viewToLoad = 'rekap';
    //     renderPayrollRekap();

    //     // Cek jika ada konteks untuk menampilkan detail payroll
    //     if (pageLoadContext.month) {
    //         renderPayrollDetail(pageLoadContext.month);
    //     }
    //     else if (pageLoadContext && pageLoadContext.view) {
    //         viewToLoad = pageLoadContext.view;
    //     }
    //     else if (pageLoadContext && pageLoadContext.month) {
    //         setPayrollView('detail', pageLoadContext.month);
    //     } else {
    //         // Default: Tampilkan rekap
    //         setPayrollView('rekap');
    //     }

    //     setPayrollView(viewToLoad, pageLoadContext.month);
    // }

    else if (pageId === 'payroll') {
        // Tentukan tampilan default: Rekap, Detail, atau Disbursement
        let viewToLoad = 'rekap';
        if (pageLoadContext && pageLoadContext.view) {
            viewToLoad = pageLoadContext.view;
        } else if (pageLoadContext && pageLoadContext.month) {
            // Jika ada bulan di konteks tapi view tidak dispesifikasikan, asumsikan 'detail'
            viewToLoad = 'detail';
        }

        // Panggil fungsi kontrol tampilan utama
        setPayrollView(viewToLoad, pageLoadContext.month);
    }
}

function switchTab(groupName, contentId, clickedButton) {

    // 1. MENCEGAH SCROLLING KE ATAS
    if (event) {
        event.preventDefault();
    }

    // 1. Sembunyikan semua konten tab dalam grup yang sama
    // (Asumsi semua konten tab memiliki class 'tab-content')
    const allContents = document.querySelectorAll('.tab-content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });

    // 2. Hapus status aktif dari semua tombol tab
    // (Asumsi semua tombol tab memiliki class 'tab-button')
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(button => {
        button.classList.remove('active-tab');
    });

    // 3. Tampilkan konten yang dipilih
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // 4. Aktifkan tombol yang diklik
    if (clickedButton) {
        clickedButton.classList.add('active-tab');
    }
}

// --- CORE HR & KARYAWAN LOGIC ---

// Dipanggil saat tombol 'Detail' di tabel list ditekan
function showDetail(index) {
    // Simpan konteks data yang akan dimuat
    pageLoadContext.employeeIndex = index;

    // Muat halaman detail baru (employee-detail.html)
    loadPage('employee-detail');
}

function openModal(mode, index = null) {
    const modal = document.getElementById('employee-modal');
    const title = document.getElementById('modal-title');
    const submitBtn = document.getElementById('modal-submit-button');

    // Reset form
    document.getElementById('employee-form').reset();
    document.getElementById('employee-id').value = '';

    if (mode === 'add') {
        title.textContent = 'Tambah Karyawan Baru';
        submitBtn.textContent = 'Simpan Data';
    } else if (mode === 'edit' && index !== null) {
        title.textContent = 'Edit Data Karyawan';
        submitBtn.textContent = 'Update Data';
        currentEmployeeIndex = index;

        // Cek jika sedang di halaman detail, gunakan currentEmployeeDetail
        let empToEdit = employees[index];
        if (!empToEdit && currentEmployeeDetail) {
            empToEdit = currentEmployeeDetail;
            currentEmployeeIndex = employees.findIndex(e => e.nik === empToEdit.nik);
        }

        // Isi form dengan data yang ada
        document.getElementById('employee-id').value = empToEdit.nik;
        document.getElementById('nik').value = empToEdit.nik;
        document.getElementById('name').value = empToEdit.name;
        document.getElementById('position').value = empToEdit.position;
        document.getElementById('department').value = empToEdit.department;
        document.getElementById('contractStatus').value = empToEdit.contractStatus;
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('employee-modal').classList.add('hidden');
    document.getElementById('employee-form').reset();
}

function handleEmployeeSubmit(event) {
    event.preventDefault();
    // Logika simpan data (simulasi)
    alert('Data Karyawan berhasil disimpan/diupdate (Simulasi)');
    closeModal();
    // Jika sedang di halaman detail, muat ulang detail
    if (document.getElementById('detail-name')) {
        // Logika untuk me-render ulang detail setelah edit (simulasi)
        // Jika data di-update, panggil render Personal Data lagi
        if (currentEmployeeDetail) {
            renderPersonalData(currentEmployeeDetail);
        }
    } else {
        filterAndRenderEmployees();
    }
}

function deleteEmployee(index) {
    if (confirm(`Yakin ingin menghapus karyawan ${employees[index].name}? (Simulasi)`)) {
        employees.splice(index, 1);
        filterAndRenderEmployees();
    }
}

// Detail Karyawan Tabs
function changeDetailTab(tabId) {
    if (!currentEmployeeDetail) return;

    const tabs = document.querySelectorAll('.detail-tabs .tab-button');
    const contents = document.querySelectorAll('.detail-content-area .tab-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });

    contents.forEach(content => {
        content.style.display = 'none';
        if (content.id === tabId) {
            content.style.display = 'block';
        }
    });

    const emp = currentEmployeeDetail;

    // Panggil Fungsi Render Sesuai Tab
    switch (tabId) {
        case 'personal':
            renderPersonalData(emp);
            break;
        case 'job':
            renderJobData(emp);
            break;
        case 'career':
            renderCareerHistory(emp); // Riwayat Karir Timeline
            break;
        case 'docs':
            renderDocumentData(emp);
            break;
    }
}


// --- TIME & ATTENDANCE LOGIC ---

function changeAttendanceTab(event, tabId) {
    // Kelola tampilan tab
    const tabs = document.querySelectorAll('.tabs .tab-button');
    const contents = document.querySelectorAll('.card.wide-card > .tab-content');

    // Jika event ada, set active class di tombol yang diklik
    if (event) {
        tabs.forEach(tab => tab.classList.remove('active'));
        event.currentTarget.classList.add('active');
    } else {
        // Jika dipanggil dari initializePage, cari tabId yang sesuai
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.toLowerCase().includes(tabId)) {
                tab.classList.add('active');
            }
        });
    }

    // Kelola tampilan konten
    contents.forEach(content => {
        content.style.display = 'none';
        if (content.id === tabId) {
            content.style.display = 'block';
        }
    });
}

function openApprovalModal(type, id) {
    const modal = document.getElementById('approval-modal');
    const title = document.getElementById('approval-modal-title');
    const reviewContent = document.getElementById('review-content');

    let record, array, recordType;

    if (type === 'leave') {
        array = leaveRequests;
        recordType = 'Pengajuan Cuti';
    } else { // type === 'other' (Lembur/Izin)
        array = approvalRecords;
        recordType = 'Permintaan Lain';
    }

    record = array.find(r => r.id === id);
    if (!record) return alert('Data tidak ditemukan!');

    currentApprovalRecord = { ...record, type: type };

    title.textContent = `Review ${recordType}: ${record.name}`;
    renderReviewContent(record, recordType, reviewContent);

    modal.classList.remove('hidden');
}

function closeApprovalModal() {
    document.getElementById('approval-modal').classList.add('hidden');
    currentApprovalRecord = null;
}

function processApproval(action) {
    if (!currentApprovalRecord) return;

    if (confirm(`Yakin ingin ${action === 'approve' ? 'MENYETUJUI' : 'MENOLAK'} permintaan ini?`)) {
        const newStatus = action === 'approve' ? 'Disetujui' : 'Ditolak';

        // Update data status
        const array = currentApprovalRecord.type === 'leave' ? leaveRequests : approvalRecords;
        const renderFunc = currentApprovalRecord.type === 'leave' ? renderLeaveRequests : renderApprovalRecords;

        const index = array.findIndex(r => r.id === currentApprovalRecord.id);
        if (index !== -1) {
            array[index].status = newStatus;

            // Logika simulasi update saldo cuti jika disetujui
            if (currentApprovalRecord.type === 'leave' && action === 'approve') {
                // Dalam simulasi ini, kita tidak mengurangi saldo cuti secara real-time
                // Tapi dalam aplikasi nyata, logic pengurangan saldo akan terjadi di sini
            }

            renderFunc();
            renderLeaveBalances();
        }

        alert(`Permintaan ${currentApprovalRecord.name} berhasil ${newStatus.toLowerCase()}!`);
        closeApprovalModal();
    }
}

function openLeaveHistoryModal(employeeName) {
    document.getElementById('leave-history-modal').classList.remove('hidden');
    document.getElementById('leave-history-title').textContent = `Riwayat Cuti Karyawan: ${employeeName}`;
    document.getElementById('leave-history-name').textContent = employeeName;
    renderEmployeeLeaveHistory(employeeName);
}

function closeLeaveHistoryModal() {
    document.getElementById('leave-history-modal').classList.add('hidden');
}


// --- SHIFT MANAGEMENT ---

function openShiftModal(mode, id = null) {
    document.getElementById('shift-modal').classList.remove('hidden');
    // Logika pengisian form shift
}
function closeShiftModal() {
    document.getElementById('shift-modal').classList.add('hidden');
}
function handleShiftSubmit(event) {
    event.preventDefault();
    alert('Shift berhasil diatur (Simulasi)');
    closeShiftModal();
}

// --- PAYROLL LOGIC ---

function generatePayroll() {
    console.log(`[PAYROLL] Memulai proses perhitungan gaji...`);
    alert(`Proses Perhitungan Gaji Selesai!\nData Payroll Rekap telah diperbarui.`);
    renderPayrollRekap();
}

function downloadPayslip(employeeName) {
    console.log(`[PAYSLIP] Membuat slip gaji PDF untuk ${employeeName}...`);
    alert(`Slip Gaji ${employeeName} berhasil dibuat (Simulasi Download PDF).`);
}

// Fungsi untuk mengatur tampilan halaman Payroll
// function setPayrollView(view, month = null) {
//     const rekapSection = document.getElementById('payroll-rekap-section');
//     const detailSection = document.getElementById('payroll-detail-section'); const disbursementSection = document.getElementById('payroll-disbursement-section');

//     if (view === 'rekap') {
//         // Tampilkan rekap, sembunyikan detail
//         rekapSection.style.display = 'block';
//         detailSection.style.display = 'none';
//         renderPayrollRekap(); // Refresh data rekap
//     } else if (view === 'detail' && month) {
//         // Tampilkan detail, sembunyikan rekap
//         rekapSection.style.display = 'none';
//         detailSection.style.display = 'block';
//         // Panggil fungsi rendering detail dengan data bulan
//         renderPayrollDetail(month);
//     }
// }
function setPayrollView(view, month = null) {
    const rekapSection = document.getElementById('payroll-rekap-section');
    const detailSection = document.getElementById('payroll-detail-section');
    const disbursementSection = document.getElementById('payroll-disbursement-section');

    // Ambil semua tombol tab Payroll untuk mengontrol status aktif
    const allTabButtons = document.querySelectorAll('.tabs-nav .tab-button');

    // --- 1. SEMBUNYIKAN SEMUA KONTEN ---

    // Sembunyikan semua section (Pastikan ID-nya ada di payroll.html)
    if (rekapSection) rekapSection.style.display = 'none';
    if (detailSection) detailSection.style.display = 'none';
    if (disbursementSection) disbursementSection.style.display = 'none';

    // Hapus status aktif dari semua tombol tab
    allTabButtons.forEach(button => {
        button.classList.remove('active-tab');
    });

    // --- 2. TAMPILKAN KONTEN DAN ATUR STATUS AKTIF ---

    if (view === 'rekap') {
        if (rekapSection) rekapSection.style.display = 'block';
        renderPayrollRekap(); // Fungsi dari render.js

        // Aktifkan tombol 'Rekap & Perhitungan' (Tombol pertama)
        const rekapButton = document.querySelector('.tabs-nav button:nth-child(1)');
        if (rekapButton) rekapButton.classList.add('active-tab');

    } else if (view === 'detail' && month) {
        if (detailSection) detailSection.style.display = 'block';
        renderPayrollDetail(month); // Fungsi dari render.js

        // Tampilan detail adalah sub-view dari 'Rekap & Perhitungan', jadi tombol itu tetap aktif.
        const rekapButton = document.querySelector('.tabs-nav button:nth-child(1)');
        if (rekapButton) rekapButton.classList.add('active-tab');

    } else if (view === 'disbursement') {
        if (disbursementSection) disbursementSection.style.display = 'block';
        renderDisbursementTable(); // Fungsi dari render.js

        // Aktifkan tombol 'Disbursement (Transfer Gaji)' (Tombol kedua)
        const disbursementButton = document.querySelector('.tabs-nav button:nth-child(2)');
        if (disbursementButton) disbursementButton.classList.add('active-tab');
    }
}

// Fungsi Simulasi untuk Output Penting Payroll
function simulateDownload(fileType, month) {
    alert(`Simulasi: ${fileType} untuk periode ${month} siap diunduh!`);
}

// Fungsi Simulasi untuk Proses Disbursement (Transfer)
function disbursePayroll(month) {
    alert(`Simulasi: Proses Batch Disbursement untuk ${month} dimulai. Status berubah menjadi 'Menunggu Checker'.`);
    // Logic nyata akan melibatkan API bank dan approval berlapis.
    // Di sini kita hanya akan memuat ulang tampilan disbursement.
    loadPage('payroll', { view: 'disbursement' });
}