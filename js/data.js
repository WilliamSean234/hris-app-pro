// js/data.js (Data Simulasi Aplikasi HRIS PRO - FINAL LENGKAP)

// Catatan: Variabel-variabel ini harus dapat diakses secara global oleh render.js dan core.js.

// --- 1. DATA KARYAWAN (CORE HR) ---
const employees = [
    {
        nik: "2020001",
        name: "Budi Santoso",
        photoUrl: "assets/img/photo-budi.jpg",
        position: "Senior Developer",
        department: "IT",
        contractStatus: "Tetap",
        joinDate: "2020-05-15",

        // Detail Pribadi (Dashboard & Core HR)
        fullName: "Budi Santoso",
        email: "budi@hris.com",
        phone: "081234567890",
        address: "Jl. Merdeka No. 10, Jakarta",
        birthDate: "1990-01-01",
        bankAccount: "123456789",
        dataKTP: "3210xxxx",
        dataBPJS: "BPJS Kesehatan Kelas 1",

        // Data Pekerjaan
        level: "Specialist",
        salary: "Rp 15.000.000",
        manager: "Joko Susilo",

        // Riwayat Karir (Timeline)
        careerHistory: [
            { date: "2023-01-01", type: "Promosi", detail: "Dipromosikan menjadi Senior Developer" },
            { date: "2020-05-15", type: "Rekrutmen", detail: "Bergabung sebagai Junior Developer" }
        ],

        // Dokumen Digital
        documents: [
            { name: "KTP", uri: "#" },
            { name: "Kontrak Kerja (Terbaru)", uri: "#" },
            { name: "Ijazah S1", uri: "#" }
        ],
        // Detail Payroll
        payrollDetail: {
            baseSalary: 10000000,
            fixedAllowance: 3000000,
            bpjsTk: 200000,
            bpjsKs: 150000,
            pph21Rate: 0.05 // Simulasi PPh 21 5%
        },
    },
    {
        nik: "2021005",
        name: "Siti Aisyah",
        photoUrl: "assets/img/photo-siti.jpg",
        position: "HR Staff",
        department: "HRD",
        contractStatus: "Kontrak",
        joinDate: "2021-11-20",

        // Detail Pribadi
        fullName: "Siti Aisyah",
        email: "siti@hris.com",
        phone: "085555444333",
        address: "Jl. Kebon Jeruk No. 5, Bogor",
        birthDate: "1995-03-25",
        bankAccount: "987654321",
        dataKTP: "3271xxxx",
        dataBPJS: "Belum Lengkap", // Peringatan di Dashboard 

        // Data Pekerjaan
        level: "Staff",
        salary: "Rp 6.000.000",
        manager: "Rani Dewi",

        // Riwayat Karir (Timeline)
        careerHistory: [
            { date: "2021-11-20", type: "Rekrutmen", detail: "Bergabung sebagai HR Staff (Kontrak)" }
        ],

        // Dokumen Digital
        documents: [
            { name: "KTP", uri: "#" },
            { name: "Kontrak Kerja (Tahun Ini)", uri: "#" }
        ]
        ,
        // Detail Payroll
        payrollDetail: {
            baseSalary: 10000000,
            fixedAllowance: 3000000,
            bpjsTk: 200000,
            bpjsKs: 150000,
            pph21Rate: 0.05 // Simulasi PPh 21 5%
        },
    },
    {
        nik: "2022010",
        name: "Joko Susilo",
        photoUrl: "assets/img/photo-joko.jpg",
        position: "Manager IT",
        department: "IT",
        contractStatus: "Tetap",
        joinDate: "2022-01-10",

        // Detail Pribadi
        fullName: "Joko Susilo",
        email: "joko@hris.com",
        phone: "08111222333",
        address: "Jl. Gajah Mada No. 1, Semarang",
        birthDate: "1988-07-12",
        bankAccount: "456789012",
        dataKTP: "3374xxxx",
        dataBPJS: "BPJS Ketenagakerjaan Penuh",

        // Data Pekerjaan
        level: "Manager",
        salary: "Rp 25.000.000",
        manager: "Direktur",

        // Riwayat Karir (Timeline)
        careerHistory: [
            { date: "2022-01-10", type: "Rekrutmen", detail: "Bergabung sebagai Manager IT" }
        ],

        // Dokumen Digital
        documents: [
            { name: "KTP", uri: "#" },
            { name: "Sertifikat Keahlian", uri: "#" }
        ],
        // Detail Payroll
        payrollDetail: {
            baseSalary: 10000000,
            fixedAllowance: 3000000,
            bpjsTk: 200000,
            bpjsKs: 150000,
            pph21Rate: 0.05 // Simulasi PPh 21 5%
        },
    },
    {
        nik: "2023015",
        name: "Rani Dewi",
        photoUrl: "assets/img/photo-rani.jpg",
        position: "HR Manager",
        department: "HRD",
        contractStatus: "Tetap",
        joinDate: "2023-08-01",

        // Detail Pribadi
        fullName: "Rani Dewi",
        email: "rani@hris.com",
        phone: "08777666555",
        address: "Jl. Sudirman No. 20, Bandung",
        birthDate: "1992-10-30",
        bankAccount: "789012345",
        dataKTP: "3273xxxx",
        dataBPJS: "BPJS Kesehatan Kelas 2",

        // Data Pekerjaan
        level: "Manager",
        salary: "Rp 20.000.000",
        manager: "Direktur",

        // Riwayat Karir (Timeline)
        careerHistory: [
            { date: "2023-08-01", type: "Rekrutmen", detail: "Bergabung sebagai HR Manager" }
        ],

        // Dokumen Digital
        documents: [
            { name: "KTP", uri: "#" },
            { name: "Sertifikat HR", uri: "#" }
        ]
        ,
        // Detail Payroll
        payrollDetail: {
            baseSalary: 10000000,
            fixedAllowance: 3000000,
            bpjsTk: 200000,
            bpjsKs: 150000,
            pph21Rate: 0.05 // Simulasi PPh 21 5%
        },
    }
];

// --- 2. DATA ABSENSI HARI INI (TIME & ATTENDANCE) ---
const attendanceData = [
    { name: "Budi Santoso", shift: "Pagi A", clockIn: "08:00", clockOut: "17:00", duration: "9 Jam", status: "Hadir Tepat Waktu" },
    { name: "Siti Aisyah", shift: "Pagi A", clockIn: "08:15", clockOut: "17:00", duration: "8 Jam 45 Menit", status: "Terlambat" },
    { name: "Joko Susilo", shift: "Siang B", clockIn: "13:00", clockOut: "21:00", duration: "8 Jam", status: "Hadir Tepat Waktu" },
    { name: "Rani Dewi", shift: "Malam C", clockIn: "-", clockOut: "-", duration: "-", status: "Tidak Hadir" }
];

// --- 3. DATA PENGAJUAN CUTI (APPROVAL) ---
const leaveRequests = [
    { id: 101, name: "Joko Susilo", type: "Cuti Tahunan", period: "2025-12-01 s/d 2025-12-05", days: 5, remaining: "7 Hari", status: "Menunggu Atasan" },
    { id: 102, name: "Rani Dewi", type: "Cuti Sakit", period: "2025-11-20 s/d 2025-11-20", days: 1, remaining: "10 Hari", status: "Menunggu HR" }
];

// --- 4. DATA SALDO CUTI ---
const leaveBalances = [
    { name: "Budi Santoso", annualQuota: 12, used: 2, balance: 10 },
    { name: "Siti Aisyah", annualQuota: 12, used: 5, balance: 7 },
    { name: "Joko Susilo", annualQuota: 12, used: 5, balance: 7 },
    { name: "Rani Dewi", annualQuota: 12, used: 2, balance: 10 }
];

// --- 5. DATA RIWAYAT CUTI (Digunakan di render.js) ---
const leaveHistoryData = [
    { name: "Budi Santoso", type: "Tahunan", start: "2024-05-10", end: "2024-05-12", duration: 3, status: "Disetujui" },
    { name: "Siti Aisyah", type: "Sakit", start: "2025-01-01", end: "2025-01-01", duration: 1, status: "Disetujui" }
];

// --- 6. DATA APPROVAL LEMBUR/LAINNYA ---
const approvalRecords = [
    { id: 201, name: "Budi Santoso", type: "Lembur", date: "2025-11-19", detail: "Perbaikan server darurat (3 jam)", status: "Menunggu Atasan" },
    { id: 202, name: "Siti Aisyah", type: "Izin Dinas", date: "2025-11-25", detail: "Pelatihan BPJS Ketenagakerjaan", status: "Menunggu HR" }
];

// --- 7. DATA PAYROLL REKAP ---
const payrollRekap = [
    { month: "November 2025", totalEmployees: 4, netPayroll: "Rp 38.000.000", status: "Final (Selesai)" },
    { month: "Desember 2025", totalEmployees: 4, netPayroll: "Belum Dihitung", status: "Draft" }
];