// js/render.js (Fungsi-fungsi untuk Rendering Tampilan)

// Catatan: Fungsi-fungsi ini mengasumsikan variabel data (employees, attendanceData, dll.)
// telah dimuat dari js/data.js.

// --- 1. DASHBOARD FUNCTIONS ---

// js/render.js - BAGIAN PERBAIKAN DASHBOARD

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
function renderPayrollRekap() {
    // ID tabel harus sinkron dengan payroll.html
    const tableBody = document.querySelector('#payroll-rekap-table tbody');

    if (!tableBody) return;

    tableBody.innerHTML = ''; // Kosongkan data lama

    // Gunakan array payrollRekap dari data.js
    payrollRekap.forEach(rekap => {
        const row = createPayrollRekapRow(rekap);
        tableBody.appendChild(row);
    });
}

// Fungsi ini akan dipanggil di halaman detail payroll
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
    `;

    // Looping untuk menghitung gaji setiap karyawan
    employees.forEach(emp => {
        const base = emp.payrollDetail.baseSalary;
        const allowance = emp.payrollDetail.fixedAllowance;
        const overtime = 500000; // Simulasi lembur tetap
        const gross = base + allowance + overtime;

        const bpjsTotal = emp.payrollDetail.bpjsTk + emp.payrollDetail.bpjsKs;
        const pph21 = gross * emp.payrollDetail.pph21Rate;

        const netSalary = gross - bpjsTotal - pph21;

        // Helper untuk format Rupiah
        const formatRupiah = (num) => `Rp ${num.toLocaleString('id-ID')}`;

        html += `
            <tr>
                <td>${emp.name}</td>
                <td>${formatRupiah(base)}</td>
                <td>${formatRupiah(allowance)}</td>
                <td>${formatRupiah(overtime)}</td>
                <td>(${formatRupiah(pph21)})</td>
                <td>(${formatRupiah(bpjsTotal)})</td>
                <td><strong>${formatRupiah(netSalary)}</strong></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    // Kontrol Output
    html += `
        <h4 class="mt-30">Output Penting Payroll</h4>
        <div class="payroll-output-controls">
            <button class="btn btn-success"><i class="fas fa-file-pdf"></i> Generate Slip Gaji PDF</button>
            <button class="btn btn-warning"><i class="fas fa-file-excel"></i> File Transfer Bank (Simulasi)</button>
            <button class="btn btn-info"><i class="fas fa-file-invoice"></i> File BPJS dan Pajak</button>
        </div>
    `;

    detailDiv.innerHTML = html;
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