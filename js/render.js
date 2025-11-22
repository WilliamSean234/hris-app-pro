// js/render.js (Logika Rendering DOM Aplikasi HRIS PRO - FINAL LENGKAP)

// --- UTILITY FUNCTIONS ---
function formatRupiah(number) {
    if (typeof number !== 'number') {
        // Asumsi dataKaryawan.salary sudah berupa string terformat jika number bukan number
        return number;
    }
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(number);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function getStatusBadge(status) {
    let colorClass = 'badge-secondary';
    let icon = '';

    if (status.includes('Selesai') || status.includes('Disetujui')) {
        colorClass = 'badge-success';
        icon = '<i class="fa-solid fa-check-circle"></i>';
    } else if (status.includes('Menunggu') || status.includes('Draft')) {
        colorClass = 'badge-warning';
        icon = '<i class="fa-solid fa-clock"></i>';
    } else if (status.includes('Terlambat') || status.includes('Ditolak')) {
        colorClass = 'badge-danger';
        icon = '<i class="fa-solid fa-xmark-circle"></i>';
    } else if (status.includes('Hadir Tepat Waktu')) {
        colorClass = 'badge-primary';
        icon = '<i class="fa-solid fa-calendar-check"></i>';
    }

    return `<span class="badge ${colorClass}">${icon} ${status}</span>`;
}


// --- 1. DASHBOARD RENDERING ---

let currentCalendarDate; // Didefinisikan di core.js, tapi pastikan ada fallback
if (typeof currentCalendarDate === 'undefined') {
    currentCalendarDate = new Date();
    currentCalendarDate.setFullYear(2025, 10, 21); // Simulasi tanggal 21 Nov 2025
}

function updateDashboardMetrics() {
    // 1. Metrik Karyawan
    document.getElementById('total-employees').textContent = employees.length;
    document.getElementById('employees-tetap').textContent = employees.filter(e => e.contractStatus === 'Tetap').length;
    document.getElementById('employees-kontrak').textContent = employees.filter(e => e.contractStatus === 'Kontrak').length;
    document.getElementById('employees-it').textContent = employees.filter(e => e.department === 'IT').length;
    document.getElementById('employees-hrd').textContent = employees.filter(e => e.department === 'HRD').length;

    // 2. Metrik Absensi
    const hadir = attendanceData.filter(a => a.status.includes('Hadir')).length;
    const terlambat = attendanceData.filter(a => a.status.includes('Terlambat')).length;
    const tidakHadir = attendanceData.filter(a => a.status.includes('Tidak Hadir')).length;

    document.getElementById('total-hadir').textContent = hadir;
    document.getElementById('total-terlambat').textContent = terlambat;
    document.getElementById('total-tidak-hadir').textContent = tidakHadir;

    // 3. Peringatan Cepat (Simulasi)
    const warningList = document.getElementById('quick-warnings');
    warningList.innerHTML = '';

    employees.filter(e => e.dataBPJS === 'Belum Lengkap').forEach(emp => {
        warningList.innerHTML += `
            <li class="text-danger"><i class="fa-solid fa-circle-exclamation"></i> Data BPJS ${emp.name} belum lengkap.</li>
        `;
    });

    leaveRequests.filter(r => r.status.includes('Menunggu')).forEach(req => {
        warningList.innerHTML += `
            <li class="text-warning"><i class="fa-solid fa-clock"></i> Cuti ${req.name} (${req.days} hari) menunggu persetujuan.</li>
        `;
    });

    if (warningList.innerHTML === '') {
        warningList.innerHTML = `<li class="text-success"><i class="fa-solid fa-check"></i> Semua data operasional terlihat baik.</li>`;
    }

    // 4. Kalender Event
    renderCalendar();
}

function renderCalendar() {
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const daysContainer = document.getElementById('calendar-days');

    // Pastikan currentCalendarDate adalah objek Date yang valid
    if (!(currentCalendarDate instanceof Date)) {
        currentCalendarDate = new Date();
    }

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth(); // 0-indexed

    monthYearDisplay.textContent = new Date(year, month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    daysContainer.innerHTML = '';

    // Hitung hari pertama bulan dan jumlah hari dalam bulan
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Minggu, 1=Senin
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Hari ini (tanggal simulasi 21 Nov 2025)
    const today = new Date(2025, 10, 21);

    // Isi hari-hari kosong di awal bulan
    // Perhatikan: JavaScript getDay() 0=Minggu. Kita ingin 1=Senin.
    const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < startDayIndex; i++) {
        daysContainer.innerHTML += '<div></div>';
    }

    // Isi tanggal
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        let classes = 'calendar-day';
        let eventsHtml = '';

        // Tanda Hari Ini (Tanggal simulasi 21 Nov)
        const isToday = (currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear());

        if (isToday) {
            classes += ' today';
        }

        // Cek Event
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const relevantEvents = hrEvents.filter(e => e.date === dateString);

        relevantEvents.forEach(event => {
            let eventClass = 'event-' + event.type;
            let icon = '';
            if (event.type === 'payroll') icon = '<i class="fa-solid fa-money-bill-transfer"></i>';
            if (event.type === 'training') icon = '<i class="fa-solid fa-graduation-cap"></i>';
            if (event.type === 'meeting') icon = '<i class="fa-solid fa-users"></i>';

            eventsHtml += `<span class="event-dot ${eventClass}" title="${event.title}">${icon}</span>`;
            classes += ' has-event';
        });

        daysContainer.innerHTML += `<div class="${classes}">${day}${eventsHtml}</div>`;
    }
}

function changeMonth(delta) {
    const newDate = new Date(currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta));
    currentCalendarDate = newDate;
    renderCalendar();
}


// --- 2. CORE HR RENDERING ---

function filterAndRenderEmployees() {
    const searchTerm = (document.getElementById('search-employee')?.value || '').toLowerCase();
    const filterDept = document.getElementById('filter-department')?.value;
    const filterStatus = document.getElementById('filter-status')?.value;
    const employeeListBody = document.getElementById('employee-list-body');

    if (!employeeListBody) return;

    let filteredEmployees = employees;

    // Filter berdasarkan Pencarian
    if (searchTerm) {
        filteredEmployees = filteredEmployees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.nik.includes(searchTerm) ||
            emp.position.toLowerCase().includes(searchTerm)
        );
    }

    // Filter berdasarkan Departemen
    if (filterDept && filterDept !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.department === filterDept);
    }

    // Filter berdasarkan Status Kontrak
    if (filterStatus && filterStatus !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.contractStatus === filterStatus);
    }

    let html = '';
    filteredEmployees.forEach((emp, index) => {
        // Cari index asli dari data karyawan global untuk fungsi edit/delete
        const globalIndex = employees.findIndex(e => e.nik === emp.nik);

        html += `
            <tr>
                <td>${emp.nik}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.department}</td>
                <td>${emp.contractStatus}</td>
                <td>${formatDate(emp.joinDate)}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="showDetail(${globalIndex})">
                        <i class="fa-solid fa-eye"></i> Detail
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="openModal('edit', ${globalIndex})">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${globalIndex})">
                        <i class="fa-solid fa-trash-can"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    employeeListBody.innerHTML = html || '<tr><td colspan="7" class="text-center">Tidak ada data karyawan yang ditemukan.</td></tr>';
}

// --- 3. EMPLOYEE DETAIL RENDERING ---

function renderPersonalData(emp) {
    const content = document.getElementById('personal');
    if (!content) return;

    content.innerHTML = `
        <div class="card wide-card">
            <h2><i class="fa-solid fa-user-circle"></i> Data Pribadi</h2>
            <div class="detail-header">
                <img src="${emp.photoUrl}" onerror="this.onerror=null; this.src='https://placehold.co/80x80/007bff/FFFFFF?text=HRIS'" alt="${emp.name}" class="employee-photo">
                <div>
                    <h3>${emp.fullName}</h3>
                    <p>${emp.position} (${emp.department})</p>
                    ${emp.dataBPJS.includes('Belum Lengkap') ?
            `<span class="badge badge-danger">PERINGATAN: Data BPJS Belum Lengkap</span>` :
            `<span class="badge badge-success">Data BPJS Lengkap</span>`
        }
                </div>
            </div>
            <div class="data-field"><span class="data-label">Email:</span> <span class="data-value">${emp.email}</span></div>
            <div class="data-field"><span class="data-label">Telepon:</span> <span class="data-value">${emp.phone}</span></div>
            <div class="data-field"><span class="data-label">Tanggal Lahir:</span> <span class="data-value">${formatDate(emp.birthDate)}</span></div>
            <div class="data-field"><span class="data-label">Alamat:</span> <span class="data-value">${emp.address}</span></div>
            <div class="data-field"><span class="data-label">No. KTP:</span> <span class="data-value">${emp.dataKTP}</span></div>
            <div class="data-field"><span class="data-label">Akun Bank:</span> <span class="data-value">${emp.bankAccount}</span></div>
            <div class="data-field"><span class="data-label">Data BPJS:</span> <span class="data-value">${emp.dataBPJS}</span></div>
        </div>
        <button class="btn btn-warning mt-3" onclick="openModal('edit', ${currentEmployeeIndex})"><i class="fa-solid fa-pen-to-square"></i> Edit Data Pribadi</button>
    `;
}

function renderJobData(emp) {
    const content = document.getElementById('job');
    if (!content) return;

    content.innerHTML = `
        <div class="card wide-card">
            <h2><i class="fa-solid fa-briefcase"></i> Data Pekerjaan</h2>
            <div class="data-field"><span class="data-label">NIK:</span> <span class="data-value">${emp.nik}</span></div>
            <div class="data-field"><span class="data-label">Jabatan:</span> <span class="data-value">${emp.position}</span></div>
            <div class="data-field"><span class="data-label">Departemen:</span> <span class="data-value">${emp.department}</span></div>
            <div class="data-field"><span class="data-label">Status Kontrak:</span> <span class="data-value">${getStatusBadge(emp.contractStatus)}</span></div>
            <div class="data-field"><span class="data-label">Tanggal Gabung:</span> <span class="data-value">${formatDate(emp.joinDate)}</span></div>
            <div class="data-field"><span class="data-label">Level Karyawan:</span> <span class="data-value">${emp.level}</span></div>
            <div class="data-field"><span class="data-label">Atasan Langsung:</span> <span class="data-value">${emp.manager}</span></div>
            <div class="data-field"><span class="data-label">Gaji Pokok (Simulasi):</span> <span class="data-value">${emp.salary}</span></div>
        </div>
        <button class="btn btn-warning mt-3" onclick="alert('Simulasi Edit Data Pekerjaan')"><i class="fa-solid fa-pen-to-square"></i> Edit Data Pekerjaan</button>
    `;
}

function renderCareerHistory(emp) {
    const content = document.getElementById('career');
    if (!content) return;

    let timelineHtml = emp.careerHistory.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${formatDate(item.date)}</div>
            <div class="timeline-type"><strong>${item.type}</strong></div>
            <div class="timeline-detail">${item.detail}</div>
        </div>
    `).join('');

    content.innerHTML = `
        <div class="card wide-card">
            <h2><i class="fa-solid fa-timeline"></i> Riwayat Karir</h2>
            <div class="timeline">
                ${timelineHtml || '<p>Tidak ada riwayat karir yang tercatat.</p>'}
            </div>
        </div>
        <button class="btn btn-primary mt-3" onclick="alert('Simulasi Tambah Riwayat Karir')"><i class="fa-solid fa-plus"></i> Tambah Riwayat</button>
    `;
}

function renderDocumentData(emp) {
    const content = document.getElementById('docs');
    if (!content) return;

    let docsHtml = emp.documents.map(doc => `
        <div class="data-field">
            <span class="data-label">${doc.name}:</span> 
            <span class="data-value">
                <a href="${doc.uri}" target="_blank" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-file-arrow-down"></i> Lihat Dokumen
                </a>
            </span>
        </div>
    `).join('');

    content.innerHTML = `
        <div class="card wide-card">
            <h2><i class="fa-solid fa-folder-open"></i> Dokumen Digital</h2>
            ${docsHtml || '<p>Tidak ada dokumen yang tersedia.</p>'}
        </div>
        <button class="btn btn-primary mt-3" onclick="alert('Simulasi Upload Dokumen')"><i class="fa-solid fa-cloud-arrow-up"></i> Upload Dokumen Baru</button>
    `;
}


// --- 4. ATTENDANCE & APPROVAL RENDERING ---

function renderAttendanceRekap() {
    const tableBody = document.getElementById('attendance-rekap-body');
    if (!tableBody) return;

    let html = '';
    attendanceData.forEach(data => {
        html += `
            <tr>
                <td>${data.name}</td>
                <td>${data.shift}</td>
                <td>${data.clockIn}</td>
                <td>${data.clockOut}</td>
                <td>${data.duration}</td>
                <td>${getStatusBadge(data.status)}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="openShiftModal('edit', '${data.name}')"><i class="fa-solid fa-calendar-alt"></i> Atur Shift</button></td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function renderLeaveRequests() {
    const tableBody = document.getElementById('leave-requests-body');
    if (!tableBody) return;

    let html = '';
    leaveRequests.forEach(req => {
        html += `
            <tr>
                <td>${req.name}</td>
                <td>${req.type}</td>
                <td>${req.period}</td>
                <td>${req.days} Hari</td>
                <td>${getStatusBadge(req.status)}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="openApprovalModal('leave', ${req.id})" ${req.status.includes('Menunggu') ? '' : 'disabled'}>
                        <i class="fa-solid fa-pen-ruler"></i> Review
                    </button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function renderApprovalRecords() {
    const tableBody = document.getElementById('other-approvals-body');
    if (!tableBody) return;

    let html = '';
    approvalRecords.forEach(rec => {
        html += `
            <tr>
                <td>${rec.name}</td>
                <td>${rec.type}</td>
                <td>${formatDate(rec.date)}</td>
                <td>${rec.detail}</td>
                <td>${getStatusBadge(rec.status)}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="openApprovalModal('other', ${rec.id})" ${rec.status.includes('Menunggu') ? '' : 'disabled'}>
                        <i class="fa-solid fa-pen-ruler"></i> Review
                    </button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function renderLeaveBalances() {
    const tableBody = document.getElementById('leave-balances-body');
    if (!tableBody) return;

    let html = '';
    leaveBalances.forEach(bal => {
        const remainingColor = bal.balance < 5 ? 'text-danger' : 'text-success';
        html += `
            <tr>
                <td>${bal.name}</td>
                <td>${bal.annualQuota} Hari</td>
                <td>${bal.used} Hari</td>
                <td class="${remainingColor}">${bal.balance} Hari</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="openLeaveHistoryModal('${bal.name}')">
                        <i class="fa-solid fa-history"></i> Riwayat
                    </button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function renderEmployeeLeaveHistory(employeeName) {
    const tableBody = document.getElementById('leave-history-table-body');
    if (!tableBody) return;

    const filteredHistory = leaveHistoryData.filter(h => h.name === employeeName);

    let html = '';
    filteredHistory.forEach(history => {
        html += `
            <tr>
                <td>${history.type}</td>
                <td>${history.start} s/d ${history.end}</td>
                <td>${history.duration} Hari</td>
                <td>${getStatusBadge(history.status)}</td>
            </tr>
        `;
    });
    tableBody.innerHTML = html || '<tr><td colspan="4">Tidak ada riwayat cuti yang ditemukan.</td></tr>';
}

function renderReviewContent(record, recordType, targetElement) {
    let content = `
        <div class="data-field"><span class="data-label">Nama Karyawan:</span> <span class="data-value">${record.name}</span></div>
        <div class="data-field"><span class="data-label">Jenis:</span> <span class="data-value">${record.type}</span></div>
    `;

    if (recordType === 'Pengajuan Cuti') {
        content += `
            <div class="data-field"><span class="data-label">Periode:</span> <span class="data-value">${record.period}</span></div>
            <div class="data-field"><span class="data-label">Durasi:</span> <span class="data-value">${record.days} Hari</span></div>
            <div class="data-field"><span class="data-label">Sisa Cuti:</span> <span class="data-value">${record.remaining}</span></div>
        `;
    } else { // Lembur/Izin Dinas
        content += `
            <div class="data-field"><span class="data-label">Tanggal:</span> <span class="data-value">${formatDate(record.date)}</span></div>
            <div class="data-field"><span class="data-label">Detail Permintaan:</span> <span class="data-value">${record.detail}</span></div>
        `;
    }

    content += `<div class="data-field"><span class="data-label">Status Saat Ini:</span> <span class="data-value">${getStatusBadge(record.status)}</span></div>`;

    targetElement.innerHTML = content;
}


// --- 5. PAYROLL RENDERING ---

function renderPayrollRekap() {
    const tableBody = document.getElementById('payroll-rekap-body');
    if (!tableBody) return;

    let html = '';
    payrollRekap.forEach(rekap => {
        html += `
            <tr>
                <td>${rekap.month}</td>
                <td>${rekap.totalEmployees} Karyawan</td>
                <td><strong>${rekap.netPayroll}</strong></td>
                <td>${getStatusBadge(rekap.status)}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="setPayrollView('detail', '${rekap.month}')" ${rekap.status.includes('Draft') ? 'disabled' : ''}>
                        <i class="fa-solid fa-list-check"></i> Detail
                    </button>
                    ${rekap.status.includes('Draft') ?
                `<button class="btn btn-success btn-sm" onclick="generatePayroll()"><i class="fa-solid fa-calculator"></i> Hitung</button>` :
                `<button class="btn btn-secondary btn-sm" onclick="simulateDownload('Laporan Payroll', '${rekap.month}')"><i class="fa-solid fa-download"></i> Laporan</button>`
            }
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function renderDisbursementTable() {
    const tableBody = document.getElementById('disbursement-rekap-body');
    if (!tableBody) return;

    let html = '';
    disbursementRecords.forEach(rec => {
        html += `
            <tr>
                <td>${rec.month}</td>
                <td>${rec.totalAmount}</td>
                <td>${rec.maker}</td>
                <td>${rec.approver}</td>
                <td>${getStatusBadge(rec.status)}</td>
                <td class="action-buttons">
                    ${rec.status === 'Draft' ?
                `<button class="btn btn-success btn-sm" onclick="disbursePayroll('${rec.month}')"><i class="fa-solid fa-share-alt"></i> Proses Transfer</button>` :
                `<button class="btn btn-primary btn-sm" onclick="simulateDownload('Bukti Transfer', '${rec.month}')"><i class="fa-solid fa-download"></i> Bukti</button>`
            }
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}


// Kalkulasi Detail Payroll (Contoh sederhana)
function calculateNetSalary(payrollDetail) {
    const { baseSalary, fixedAllowance, bpjsTk, bpjsKs, pph21Rate } = payrollDetail;
    const grossSalary = baseSalary + fixedAllowance;
    const deductions = bpjsTk + bpjsKs;

    // PPh 21 sederhana (hanya 5% dari Gaji Kotor)
    const pph21 = grossSalary * pph21Rate;

    const netSalary = grossSalary - deductions - pph21;

    return { grossSalary, deductions, pph21, netSalary };
}

function renderPayrollDetail(month) {
    const detailHeader = document.getElementById('payroll-detail-header');
    const tableBody = document.getElementById('payroll-detail-body');
    if (!detailHeader || !tableBody) return;

    detailHeader.textContent = `Rincian Gaji Bulan ${month}`;

    let totalNetSalary = 0;
    let html = '';

    employees.forEach(emp => {
        // Asumsi data payrollDetail selalu ada di data.js
        const payroll = emp.payrollDetail || { baseSalary: 0, fixedAllowance: 0, bpjsTk: 0, bpjsKs: 0, pph21Rate: 0 };
        const calculation = calculateNetSalary(payroll);
        totalNetSalary += calculation.netSalary;

        html += `
            <tr>
                <td>${emp.nik}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${formatRupiah(calculation.grossSalary)}</td>
                <td>${formatRupiah(calculation.deductions + calculation.pph21)}</td>
                <td><strong>${formatRupiah(calculation.netSalary)}</strong></td>
                <td class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="downloadPayslip('${emp.name} - ${month}')">
                        <i class="fa-solid fa-file-pdf"></i> Slip Gaji
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="alert('Simulasi Edit Komponen Gaji ${emp.name}')">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;

    // Update total net payroll di header (Simulasi: total diambil dari rekap)
    const rekapData = payrollRekap.find(r => r.month === month);
    document.getElementById('detail-total-net-payroll').textContent = rekapData ? rekapData.netPayroll : formatRupiah(totalNetSalary);
}

// Tambahkan inisialisasi awal saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Muat halaman default saat aplikasi dibuka (Dashboard)
    loadPage('dashboard');

    // Attach event listeners for search/filter in Core HR
    const searchInput = document.getElementById('search-employee');
    const filterDept = document.getElementById('filter-department');
    const filterStatus = document.getElementById('filter-status');

    if (searchInput) searchInput.addEventListener('input', filterAndRenderEmployees);
    if (filterDept) filterDept.addEventListener('change', filterAndRenderEmployees);
    if (filterStatus) filterStatus.addEventListener('change', filterAndRenderEmployees);
});