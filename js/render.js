// js/render.js (Fungsi-fungsi untuk Rendering Tampilan)

// Catatan: Fungsi-fungsi ini mengasumsikan variabel data (employees, attendanceData, dll.)
// telah dimuat dari js/data.js.

// --- 1. DASHBOARD FUNCTIONS ---

// js/render.js - BAGIAN PERBAIKAN DASHBOARD
const formatRupiah = (num) => `Rp ${Math.floor(num).toLocaleString('id-ID')}`;


function updateDashboardMetrics() {
    // 1. Total Karyawan Aktif
    const totalActive = employees.length;
    // MENCARI ID BARU: 'metric-total-active'
    const totalActiveEl = document.getElementById('metric-total-active');
    if (totalActiveEl) totalActiveEl.textContent = totalActive;

    // 2. Tingkat Absensi (Simulasi)
    // MENCARI ID BARU: 'metric-absensi-rate'
    const absenceRateEl = document.getElementById('metric-absensi-rate');
    // Angka 0.8% dari gambar
    if (absenceRateEl) absenceRateEl.textContent = '0.8%';

    // 3. Pengajuan Cuti Menunggu
    const pendingLeave = leaveRequests.filter(r => r.status.includes('Menunggu')).length;
    // MENCARI ID BARU: 'metric-pending-leave'
    const pendingLeaveEl = document.getElementById('metric-pending-leave');
    if (pendingLeaveEl) pendingLeaveEl.textContent = pendingLeave;

    // 4. Kontrak Berakhir (Simulasi)
    const expiringContracts = employees.filter(e => e.contractStatus === 'Kontrak' && isContractExpiring(e.joinDate)).length;
    // MENCARI ID BARU: 'metric-contract-ending'
    const contractEndingEl = document.getElementById('metric-contract-ending');
    // Angka 0 sesuai gambar
    if (contractEndingEl) contractEndingEl.textContent = '0';

    // --- Inisialisasi Tanggal Simulasi ---
    const today = new Date();
    // Atur hari ini ke 21 Nov 2025 untuk simulasi data
    today.setFullYear(2025, 10, 21);

    // Update karyawan cuti hari ini
    let activeLeaveCount = 0;
    if (typeof leaveRequests !== 'undefined') {
        activeLeaveCount = leaveRequests.filter(req => {
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            // Cek apakah tanggal hari ini berada dalam rentang cuti
            return req.status === 'Approved' && start <= today && end >= today;
        }).length;
    }
    document.getElementById('active-leave').textContent = activeLeaveCount;

    // Update pending approvals (simulasi)
    document.getElementById('pending-approvals').textContent = 2; // Contoh: 2 permintaan cuti menunggu

    // INIT KALENDER: Panggil fungsi render kalender saat metrik diupdate
    // Gunakan currentCalendarDate yang sudah disimulasikan
    renderHRCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
    document.getElementById('current-month-display').textContent = getMonthName(currentCalendarDate);



    // Render Peringatan
    renderSystemWarnings();
}

function renderSystemWarnings() {
    const warningList = document.getElementById('system-warnings');
    if (!warningList) return;

    warningList.innerHTML = ''; // Clear existing warnings

    // Peringatan 1: BPJS Belum Lengkap (Siti Aisyah)
    const bpjsWarning = employees.find(e => e.dataBPJS && e.dataBPJS.includes('Belum Lengkap'));
    if (bpjsWarning) {
        warningList.innerHTML += `<li><i class="fas fa-exclamation-triangle text-danger"></i> Lengkapi data BPJS untuk <strong>${bpjsWarning.name}</strong>.</li>`;
    }

    // Peringatan 2: Karyawan Terlambat 
    const lateEmployees = attendanceData.filter(d => d.status.includes('Terlambat')).length;
    if (lateEmployees > 0) {
        warningList.innerHTML += `<li><i class="fas fa-exclamation-triangle text-warning"></i> <strong>${lateEmployees} karyawan</strong> terlambat clock-in hari ini.</li>`;
    }

    // Peringatan 3: Kebijakan Cuti 
    warningList.innerHTML += `<li><i class="fas fa-info-circle text-info"></i> Tinjau kebijakan Cuti terbaru yang berlaku 1 Jan 2026.</li>`;
}

// Tambahkan atau pastikan fungsi isContractExpiring ada di render.js
function isContractExpiring(joinDate) {
    return false;
}

// --- 2. CORE HR (LIST & DETAIL) FUNCTIONS ---

function filterAndRenderEmployees() {
    const tableBody = document.getElementById('employee-list-body');
    if (!tableBody) return; // Keluar jika bukan di halaman Core HR List

    // (Simulasi Filter & Sortasi di sini jika diperlukan)

    tableBody.innerHTML = '';
    employees.forEach((emp, index) => {
        const row = document.createElement('tr');
        const photo = emp.photoUrl ? `<img src="${emp.photoUrl}" alt="${emp.name}" class="employee-photo">` : 'N/A';
        const statusClass = emp.contractStatus === 'Tetap' ? 'status-tetap' : 'status-kontrak';

        row.innerHTML = `
            <td>${photo}</td>
            <td>${emp.nik}</td>
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>${emp.department}</td>
            <td><span class="status-badge ${statusClass}">${emp.contractStatus}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="showDetail(${index})">
                    <i class="fas fa-eye"></i> Detail
                </button>
                <button class="btn btn-warning btn-sm" onclick="openModal('edit', ${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// FUNGSI INI ADALAH KUNCI UNTUK MENGATASI ERROR UNDEFINED DI DETAIL KARYAWAN
function renderPersonalData(emp) {
    if (!emp) return;

    const content = document.getElementById('personal');
    if (!content) return;

    // Menggunakan template grid yang sama dengan pages/employee-detail.html
    content.innerHTML = `
        <button class="btn btn-warning mb-20" onclick="openModal('edit', currentEmployeeIndex)"><i class="fas fa-edit"></i> Edit Data</button>
        <div class="data-detail-grid">
            <div class="data-item"><span>NIK</span><strong>${emp.nik || '-'}</strong></div>
            <div class="data-item"><span>Nama Lengkap</span><strong>${emp.fullName || '-'}</strong></div>
            <div class="data-item"><span>Email</span><strong>${emp.email || '-'}</strong></div>
            <div class="data-item"><span>No Rekening Bank</span><strong>${emp.bankAccount || '-'}</strong></div>
            <div class="data-item"><span>Data KTP</span><strong>${emp.dataKTP || '-'}</strong></div>
            <div class="data-item"><span>Data BPJS</span><strong>${emp.dataBPJS || '-'}</strong></div>
            <div class="data-item"><span>Tanggal Lahir</span><strong>${emp.birthDate || '-'}</strong></div>
            <div class="data-item"><span>No Telepon</span><strong>${emp.phone || '-'}</strong></div>
            <div class="data-item wide"><span>Alamat Lengkap</span><strong>${emp.address || '-'}</strong></div>
        </div>
    `;
}

function renderJobData(emp) {
    if (!emp) return;
    const content = document.getElementById('job');
    if (!content) return;

    content.innerHTML = `
        <div class="data-detail-grid">
            <div class="data-item"><span>Jabatan</span><strong>${emp.position || '-'}</strong></div>
            <div class="data-item"><span>Departemen</span><strong>${emp.department || '-'}</strong></div>
            <div class="data-item"><span>Status Kontrak</span><strong>${emp.contractStatus || '-'}</strong></div>
            <div class="data-item"><span>Tanggal Bergabung</span><strong>${emp.joinDate || '-'}</strong></div>
            <div class="data-item"><span>Level Jabatan</span><strong>${emp.level || '-'}</strong></div>
            <div class="data-item"><span>Manajer Langsung</span><strong>${emp.manager || '-'}</strong></div>
            <div class="data-item wide"><span>Gaji Pokok (Simulasi)</span><strong>${emp.salary || 'Rahasia'}</strong></div>
        </div>
    `;
}

function renderCareerHistory(emp) {
    if (!emp || !emp.careerHistory) return;
    const content = document.getElementById('career');
    if (!content) return;

    let html = '<div class="timeline-container">';
    emp.careerHistory.forEach(item => {
        html += `
            <div class="timeline-item">
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-content">
                    <strong>${item.type}</strong>
                    <p>${item.detail}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';
    content.innerHTML = html;
}

function renderDocumentData(emp) {
    if (!emp || !emp.documents) return;
    const content = document.getElementById('docs');
    if (!content) return;

    let html = '<p class="text-info-small">Daftar dokumen digital karyawan (simulasi link download).</p>';
    html += '<div class="data-detail-grid">';

    emp.documents.forEach(doc => {
        html += `
            <div class="data-item">
                <span>${doc.name}</span>
                <a href="${doc.uri}" class="btn btn-info btn-sm" target="_blank"><i class="fas fa-download"></i> Unduh</a>
            </div>
        `;
    });
    html += '</div>';
    content.innerHTML = html;
}

// --- 3. ATTENDANCE FUNCTIONS ---

function renderAttendanceRekap() {
    const tableBody = document.querySelector('#attendance-rekap-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    attendanceData.forEach(data => {
        const statusClass = data.status.includes('Tepat') ? 'status-tetap' : (data.status.includes('Terlambat') ? 'status-warning' : 'status-danger');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.shift}</td>
            <td>${data.clockIn}</td>
            <td>${data.clockOut}</td>
            <td>${data.duration}</td>
            <td><span class="status-badge ${statusClass}">${data.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function renderLeaveRequests() {
    const tableBody = document.querySelector('#leave-request-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    leaveRequests.forEach(request => {
        const statusClass = request.status.includes('Menunggu Atasan') ? 'status-warning' : 'status-pending';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.name}</td>
            <td>${request.type}</td>
            <td>${request.period}</td>
            <td>${request.remaining}</td>
            <td><span class="status-badge ${statusClass}">${request.status}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openApprovalModal('leave', ${request.id})">
                    <i class="fas fa-search"></i> Review
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderLeaveBalances() {
    const tableBody = document.querySelector('#leave-balance-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    leaveBalances.forEach(balance => {
        const row = document.createElement('tr');
        const remainingColor = balance.balance < 5 ? 'text-danger' : 'text-success';

        row.innerHTML = `
            <td><a href="#" onclick="event.preventDefault(); openLeaveHistoryModal('${balance.name}')" class="text-primary">${balance.name}</a></td>
            <td>${balance.annualQuota} Hari</td>
            <td>${balance.used} Hari</td>
            <td><strong class="${remainingColor}">${balance.balance} Hari</strong></td>
        `;
        tableBody.appendChild(row);
    });
}

function renderEmployeeLeaveHistory(employeeName) {
    const tableBody = document.querySelector('#employee-leave-history-table tbody');
    if (!tableBody) return;

    // SIMULASI data riwayat cuti spesifik per karyawan
    const historyData = [
        { name: "Budi Santoso", type: "Tahunan", start: "2024-05-10", end: "2024-05-12", duration: 3, status: "Disetujui" },
        { name: "Siti Aisyah", type: "Sakit", start: "2025-01-01", end: "2025-01-01", duration: 1, status: "Disetujui" }
    ];

    const filteredHistory = historyData.filter(h => h.name === employeeName);

    tableBody.innerHTML = '';

    if (filteredHistory.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Tidak ada riwayat cuti yang tercatat.</td></tr>`;
        return;
    }

    filteredHistory.forEach(h => {
        const statusClass = h.status === 'Disetujui' ? 'status-approved' : 'status-rejected';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${h.type}</td>
            <td>${h.start}</td>
            <td>${h.end}</td>
            <td>${h.duration} Hari</td>
            <td><span class="status-badge ${statusClass}">${h.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}


function renderApprovalRecords() {
    const tableBody = document.querySelector('#other-approval-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    approvalRecords.forEach(record => {
        const statusClass = record.status.includes('Menunggu') ? 'status-pending' : 'status-warning';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.type}</td>
            <td>${record.date}</td>
            <td>${record.detail}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openApprovalModal('other', ${record.id})">
                    <i class="fas fa-search"></i> Review
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderReviewContent(record, recordType, reviewContentElement) {
    // Fungsi ini dipanggil dari core.js saat modal dibuka
    reviewContentElement.innerHTML = `
        <div class="review-content-grid">
            <div class="data-item"><span>Pemohon</span><strong>${record.name}</strong></div>
            <div class="data-item"><span>Tipe ${recordType}</span><strong>${record.type}</strong></div>
            <div class="data-item"><span>Tanggal Pengajuan</span><strong>${record.date || record.period}</strong></div>
            <div class="data-item wide">
                <span>Keterangan / Detail</span>
                <p>${record.detail || 'Tidak ada keterangan tambahan.'}</p>
            </div>
            ${record.days ? `<div class="data-item"><span>Durasi Cuti</span><strong>${record.days} Hari</strong></div>` : ''}
            ${record.remaining ? `<div class="data-item"><span>Sisa Cuti Setelah Ini</span><strong>${record.remaining}</strong></div>` : ''}
        </div>
    `;
}

// --- 4. PAYROLL FUNCTIONS ---

// Fungsi untuk membuat baris tabel Payroll Rekap
function createPayrollRekapRow(data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${data.month}</td>
        <td>${data.totalEmployees}</td>
        <td>${data.netPayroll}</td>
        <td>
            <span class="status-badge ${data.status.includes('Selesai') ? 'status-success' : 'status-draft'}">
                ${data.status}
            </span>
            </span>
        </td>
        <td>
            <button class="btn btn-sm btn-detail" onclick="setPayrollView('detail', '${data.month}')">
                <i class="fas fa-search"></i> Detail
            </button>
        </td>
    `;
    return tr;
}

// Fungsi yang dipanggil di initializePage
// Fungsi ini mengambil data dari payrollRekap dan menampilkan tabel rekapitulasi.
function renderPayrollRekap() {
    // ID tabel harus sinkron dengan payroll.html
    const tableBody = document.querySelector('#payroll-rekap-table tbody');

    if (!tableBody) {
        console.error("Error: Element #payroll-rekap-table tbody tidak ditemukan.");
        return; // Hentikan fungsi jika elemen tidak ada
    }

    tableBody.innerHTML = ''; // Kosongkan data lama

    // Gunakan data global payrollRekap dari data.js
    if (typeof payrollRekap !== 'undefined') {
        payrollRekap.forEach(data => {
            const row = createPayrollRekapRow(data);
            tableBody.appendChild(row);
        });
    } else {
        console.error("Error: Variabel payrollRekap belum didefinisikan di data.js.");
    }
}

// Fungsi ini akan dipanggil di halaman detail payroll
// Fungsi ini menampilkan perhitungan rinci (Gaji, Lembur, Potongan PPh 21/BPJS) dari data.js.
function renderPayrollDetail(month) {
    const detailDiv = document.getElementById('payroll-detail-content');
    if (!detailDiv) return;

    // Header
    let html = `<h3>Detail Payroll Bulan ${month}</h3><hr>`;

    // Tabel Simulasi Perhitungan
    html += `
        <table class="data-table mt-15" id="payroll-detail-table">
            <thead>
                <tr>
                    <th>Karyawan</th>
                    <th>Gaji Pokok</th>
                    <th>Tunjangan</th>
                    <th>Lembur (Simulasi)</th>
                    <th>Potongan PPh 21</th>
                    <th>Potongan BPJS</th>
                    <th>Net Salary (Estimasi)</th>
                </tr>
            </thead>
            <tbody>
            <h4 class="mt-30">Output Penting Payroll</h4>
            <div class="payroll-output-controls">
                <button class="btn btn-success" onclick="simulateDownload('Slip Gaji PDF', '${month}')"><i class="fas fa-file-pdf"></i> Generate Slip Gaji PDF</button>
                <button class="btn btn-warning" onclick="simulateDownload('File Transfer Bank', '${month}')"><i class="fas fa-file-excel"></i> File Transfer Bank</button>
                <button class="btn btn-info" onclick="simulateDownload('File BPJS dan Pajak', '${month}')"><i class="fas fa-file-invoice"></i> File BPJS/Pajak</button>
            </div>
    `;


    // Looping untuk menghitung gaji setiap karyawan
    employees.forEach(emp => {
        const base = emp.payrollDetail.baseSalary;
        const allowance = emp.payrollDetail.fixedAllowance;

        // SIMULASI: Tambahkan Komponen Lain (Lembur)
        const overtime = (emp.department === 'IT') ? 500000 : 250000; // IT dapat lembur lebih besar
        // const overtime = 500000; // Simulasi lembur tetap

        const gross = base + allowance + overtime;

        const bpjsTotal = emp.payrollDetail.bpjsTk + emp.payrollDetail.bpjsKs;
        const pph21 = gross * emp.payrollDetail.pph21Rate;

        const netSalary = gross - bpjsTotal - pph21;

        // Helper untuk format Rupiah

        html += `
            <tr>
                <td>${emp.name}</td>
                <td>${formatRupiah(base)}</td>
                <td>${formatRupiah(allowance)}</td>
                <td>${formatRupiah(overtime)}</td>
                <td class="text-danger">(${formatRupiah(pph21)})</td>
                <td class="text-danger">(${formatRupiah(bpjsTotal)})</td>
                <td><strong>${formatRupiah(netSalary)}</strong></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    detailDiv.innerHTML = html;
}

function renderDisbursementTable() {
    const tableBody = document.querySelector('#disbursement-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    disbursementRecords.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.month}</td>
            <td>${record.totalAmount}</td>
            <td>${record.maker}</td>
            <td>${record.approver}</td>
            <td>
                <span class="status-badge status-${record.status.toLowerCase()}">
                    ${record.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-success" ${record.status === 'Draft' ? '' : 'disabled'} onclick="disbursePayroll('${record.month}')">
                    <i class="fas fa-share-square"></i> Disburse
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// function renderPayrollRekap() {
//     const tableBody = document.getElementById('payroll-rekap-body');
//     if (!tableBody) return;

//     tableBody.innerHTML = '';
//     payrollRekap.forEach(rekap => {
//         const statusClass = rekap.status.includes('Final') ? 'status-approved' : 'status-pending';

//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${rekap.month}</td>
//             <td>${rekap.totalEmployees} Karyawan</td>
//             <td><strong>${rekap.netPayroll}</strong></td>
//             <td><span class="status-badge ${statusClass}">${rekap.status}</span></td>
//             <td>
//                 <button class="btn btn-info btn-sm" onclick="downloadPayslip('Rekap ${rekap.month}')">
//                     <i class="fas fa-download"></i> Download
//                 </button>
//                 ${rekap.status.includes('Final') ? '' : `<button class="btn btn-primary btn-sm" onclick="generatePayroll()">
//                     <i class="fas fa-calculator"></i> Proses
//                 </button>`}
//             </td>
//         `;
//         tableBody.appendChild(row);
//     });
// }


/* CALENDAR */
// Variabel Global untuk Kalender
let currentCalendarDate = new Date();
// Atur tanggal ke 21 November 2025 (sama dengan tanggal saat ini di simulasi data)
currentCalendarDate.setFullYear(2025, 10, 21);
// Helper function untuk mendapatkan nama bulan
const getMonthName = (date) => date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

// Fungsi untuk mengganti bulan yang dilihat di kalender
function changeMonth(delta) {
    // Pastikan currentCalendarDate adalah objek Date yang valid
    if (!(currentCalendarDate instanceof Date)) {
        currentCalendarDate = new Date();
    }

    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderHRCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());

    // Update display bulan di header kalender
    document.getElementById('current-month-display').textContent = getMonthName(currentCalendarDate);
}

// Fungsi utama untuk me-render kalender HR (Fungsi yang sangat penting untuk tampilan kalender)
function renderHRCalendar(year, month) {
    const today = new Date();
    // Atur tanggal hari ini ke simulasi 21 November 2025 agar sesuai dengan data
    today.setFullYear(2025, 10, 21);

    const calendarContainer = document.getElementById('hr-calendar-container');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = '';

    // 1. Definisikan Hari Awal dan Akhir Bulan
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    // getDay() mengembalikan 0 untuk Minggu, 1 untuk Senin, dst.
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // 2. Buat Header Hari
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayNames.forEach(day => {
        calendarContainer.innerHTML += `<div class="day-header">${day}</div>`;
    });

    // 3. Hitung tanggal mulai grid (untuk mengisi hari-hari di bulan sebelumnya)
    let startDate = new Date(firstDayOfMonth);
    // Mundur ke hari Minggu pertama di baris kalender
    startDate.setDate(startDate.getDate() - firstDayOfWeek);

    // 4. Looping untuk membuat sel kalender (Total 6 minggu x 7 hari = 42 sel untuk memastikan tampilan penuh)
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let cellClass = 'day-cell';
        let cellHTML = `<span>${currentDay}</span>`;

        // Tandai sel bulan lain
        if (currentMonth !== month) {
            cellClass += ' other-month';
        }

        // Tandai Hari Ini
        const isToday = currentDay === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        if (isToday) {
            cellClass += ' today';
        }

        // 5. Cek Event untuk Tanggal Ini
        let eventsHTML = '';
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

        // A. Cek Event HR Global (Gajian, Pelatihan)
        if (typeof hrEvents !== 'undefined') {
            hrEvents.filter(e => e.date === dateString).forEach(event => {
                const typeClass = event.type === 'payroll' ? 'event-payroll' : 'event-other';
                eventsHTML += `<span class="event-indicator ${typeClass}" title="${event.title}">${event.title}</span>`;
            });
        }

        // B. Cek Cuti
        if (typeof leaveRequests !== 'undefined') {
            leaveRequests.filter(req => req.status === 'Approved' &&
                new Date(req.startDate) <= currentDate &&
                new Date(req.endDate) >= currentDate
            ).forEach(req => {
                eventsHTML += `<span class="event-indicator event-leave" title="CUTI: ${req.name}">Cuti: ${req.name}</span>`;
            });
        }

        // C. Cek Anniversary (Hanya pada bulan yang sedang dilihat)
        if (currentMonth === month && typeof employees !== 'undefined') {
            employees.filter(emp => {
                const joinDate = new Date(emp.joinDate);
                // Cek jika tanggal join sama dengan tanggal saat ini di bulan ini
                return joinDate.getDate() === currentDay && joinDate.getMonth() === currentMonth;
            }).forEach(emp => {
                const years = currentYear - new Date(emp.joinDate).getFullYear();
                if (years >= 1) { // Hanya tampilkan jika sudah 1 tahun atau lebih
                    eventsHTML += `<span class="event-indicator event-anniversary" title="Anniversary ${years} Tahun: ${emp.name}">${years} Tahun Kerja</span>`;
                }
            });
        }

        calendarContainer.innerHTML += `<div class="${cellClass}">${cellHTML}${eventsHTML}</div>`;
    }

    // Panggil fungsi untuk mengisi daftar event hari ini (hanya jika hari ini)
    if (year === today.getFullYear() && month === today.getMonth()) {
        renderTodayEvents(today);
    }
}

// Fungsi untuk mengisi daftar event hari ini di sidebar
function renderTodayEvents(date) {
    const todayEventsList = document.getElementById('today-events-list');
    const todayDateDisplay = document.getElementById('today-date-display');

    if (!todayEventsList || !todayDateDisplay) return;

    todayEventsList.innerHTML = '';

    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    todayDateDisplay.textContent = date.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    let foundEvents = false;

    // A. Event HR Global
    if (typeof hrEvents !== 'undefined') {
        hrEvents.filter(e => e.date === dateString).forEach(event => {
            const typeClass = event.type === 'payroll' ? 'item-payroll' : 'item-other';
            todayEventsList.innerHTML += `<div class="event-item ${typeClass}"><strong>${event.title}</strong></div>`;
            foundEvents = true;
        });
    }

    // B. Cuti Hari Ini
    if (typeof leaveRequests !== 'undefined') {
        leaveRequests.filter(req => req.status === 'Approved' &&
            new Date(req.startDate) <= date &&
            new Date(req.endDate) >= date
        ).forEach(req => {
            todayEventsList.innerHTML += `<div class="event-item item-leave"><strong>Cuti:</strong> ${req.name} (${req.type})</div>`;
            foundEvents = true;
        });
    }

    // C. Anniversary Hari Ini
    if (typeof employees !== 'undefined') {
        employees.filter(emp => {
            const joinDate = new Date(emp.joinDate);
            const years = date.getFullYear() - joinDate.getFullYear();
            return years >= 1 && joinDate.getDate() === date.getDate() && joinDate.getMonth() === date.getMonth();
        }).forEach(emp => {
            const years = date.getFullYear() - new Date(emp.joinDate).getFullYear();
            todayEventsList.innerHTML += `<div class="event-item item-anniversary"><strong>Anniversary ${years} Tahun:</strong> ${emp.name}</div>`;
            foundEvents = true;
        });
    }

    if (!foundEvents) {
        todayEventsList.innerHTML = `<p class="text-muted text-center mt-10">Tidak ada event spesial hari ini.</p>`;
    }
}

// Fungsi untuk menampilkan modal perhitungan
function showCalculationModal(employeeName, calculationType, details) {
    const modal = document.getElementById('calculation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    if (!modal || !modalBody) return;

    modalTitle.textContent = `Perhitungan ${calculationType} untuk ${employeeName}`;

    let html = `
        <table class="data-table" style="width: 100%;">
            <thead>
                <tr>
                    <th>Deskripsi</th>
                    <th>Nilai</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
    `;

    details.forEach(item => {
        const valueDisplay = item.isRupiah ? formatRupiah(item.value) : item.value;
        html += `
            <tr>
                <td>${item.label}</td>
                <td>${valueDisplay}</td>
                <td>${item.note || ''}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    modalBody.innerHTML = html;

    modal.style.display = 'flex';
}
