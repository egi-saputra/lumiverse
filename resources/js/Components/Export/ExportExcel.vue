<script setup>
/**
 * ExportExcel.vue
 *
 * Fix:
 * - import * as XLSX from 'xlsx-js-style'  ← wajib, bukan default import
 * - freeze pane format yang benar
 * - error handling per-cell agar satu cell gagal tidak crash semua
 */
import { ref } from 'vue'
import * as XLSX from 'xlsx-js-style'

const props = defineProps({
    kelas: { type: Object, default: null },
    label: { type: String, default: '' },
    hariEfektif: { type: Array, default: () => [] },
    siswa: { type: Array, default: () => [] },
    rekapKelas: { type: Object, default: null },
    avgKehadiran: { type: [Number, null], default: null },
    allCatatan: { type: Array, default: () => [] },
})

const STATUS = {
    hadir: { label: 'Hadir', short: 'H' },
    sakit: { label: 'Sakit', short: 'S' },
    izin: { label: 'Izin', short: 'I' },
    alpha: { label: 'Alpha', short: 'A' },
}

const exporting = ref(false)
const errorMsg = ref('')

// ─── Auto width ───────────────────────────────────────────────
function calcColWidths(rows) {
    if (!rows.length) return []
    const widths = Array(rows[0].length).fill(0)
    rows.forEach(row => {
        row.forEach((cell, i) => {
            const len = cell !== null && cell !== undefined ? String(cell).length : 0
            if (len > widths[i]) widths[i] = len
        })
    })
    return widths.map(w => ({ wch: Math.min(40, Math.max(10, w + 4)) }))
}

// ─── Base style ───────────────────────────────────────────────
const BORDER = {
    top: { style: 'thin', color: { rgb: 'D1D5DB' } },
    right: { style: 'thin', color: { rgb: 'D1D5DB' } },
    bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
    left: { style: 'thin', color: { rgb: 'D1D5DB' } },
}

function makeStyle({ bold = false, bg = 'FFFFFF', color = '1E293B', align = 'center', size = 11 } = {}) {
    return {
        font: { bold, color: { rgb: color }, sz: size, name: 'Calibri' },
        fill: { patternType: 'solid', fgColor: { rgb: bg } },
        alignment: { horizontal: align, vertical: 'center', wrapText: true },
        border: BORDER,
    }
}

// ─── Safe cell style setter ───────────────────────────────────
function setStyle(ws, r, c, style) {
    const addr = XLSX.utils.encode_cell({ r, c })
    if (!ws[addr]) return
    ws[addr].s = style
}

// ─── Export ───────────────────────────────────────────────────
function handleExport() {
    exporting.value = true
    errorMsg.value = ''

    try {
        const kelas = JSON.parse(JSON.stringify(props.kelas ?? {}))
        const label = String(props.label ?? '')
        const siswa = JSON.parse(JSON.stringify(props.siswa ?? []))
        const rekap = JSON.parse(JSON.stringify(props.rekapKelas ?? {}))
        const avgKeh = props.avgKehadiran
        const catatan = JSON.parse(JSON.stringify(props.allCatatan ?? []))

        const safeLabel = label.replace(/\s+/g, '_').replace(/[^\w-]/g, '')
        const fileName = `Rekap_Absensi_${kelas.kelas ?? 'Kelas'}_${safeLabel}`

        // ── Sheet 1 data ─────────────────────────────────────────
        const headers = ['No', 'Nama Siswa', 'NIS', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Tingkat Kehadiran']

        const dataRows = siswa.map((s, i) => [
            i + 1,
            s.nama_lengkap,
            s.nis,
            s.counts.hadir,
            s.counts.sakit,
            s.counts.izin,
            s.counts.alpha,
            s.pct_kehadiran !== null && s.pct_kehadiran !== undefined ? `${s.pct_kehadiran}%` : '—',
        ])

        // Row 0: judul, Row 1: info, Row 2: kosong, Row 3: summary, Row 4: kosong, Row 5: header, Row 6+: data
        const wsData = [
            ['REKAP ABSENSI SISWA'],
            [`Kelas: ${kelas.kelas ?? ''}  |  Wali Kelas: ${kelas.guru_nama ?? ''}  |  Periode: ${label}`],
            [],
            // [
            //     'Hari Efektif', rekap.hari_efektif ?? '',
            //     'Total Hadir', rekap.total_hadir ?? '',
            //     'Total Sakit', rekap.total_sakit ?? '',
            //     'Total Izin', rekap.total_izin ?? '',
            //     'Total Alpha', rekap.total_alpha ?? '',
            //     'Rata-rata', avgKeh !== null ? `${avgKeh}%` : '—',
            // ],
            [],
            headers,
            ...dataRows,
        ]

        const ws = XLSX.utils.aoa_to_sheet(wsData)

        // Tinggi row
        ws['!rows'] = []

        // Title
        ws['!rows'][0] = { hpt: 30 }

        // Info
        ws['!rows'][1] = { hpt: 22 }

        // Header tabel
        ws['!rows'][4] = { hpt: 24 }

        // Merge title & info
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
        ]

        ws['!cols'] = calcColWidths([headers, ...dataRows])

        // Freeze pane
        ws['!freeze'] = { xSplit: 0, ySplit: 6, topLeftCell: 'A7', state: 'frozen' }

        // Title (row 0)
        setStyle(ws, 0, 0, makeStyle({
            bold: true,
            bg: '4F46E5',
            color: 'FFFFFF',
            align: 'center',
            size: 16,
        }))

        // Info (row 1)
        setStyle(ws, 1, 0, makeStyle({ bg: 'EEF2FF', align: 'center', size: 12 }))

        // Summary (row 3) — 12 cell: label + nilai x6
        for (let c = 0; c < 12; c++) {
            setStyle(ws, 3, c, makeStyle({
                bold: c % 2 === 0,
                bg: c % 2 === 0 ? 'E5E7EB' : 'FFFFFF',
                align: 'center',
            }))
        }

        // Header (row 5)
        headers.forEach((_, c) => {
            setStyle(ws, 4, c, makeStyle({ bold: true, bg: '1E293B', color: 'FFFFFF', align: 'center' }))
        })

        // Data rows (row 6+)
        dataRows.forEach((row, ri) => {
            row.forEach((_, ci) => {
                setStyle(ws, 5 + ri, ci, makeStyle({
                    align: ci === 1 ? 'left' : 'center',
                    bg: ri % 2 === 0 ? 'FFFFFF' : 'F9FAFB',
                }))
            })
        })

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Rekap Kehadiran')

        // ── Sheet 2: Keterangan Absensi ───────────────────────────
        if (catatan.length) {
            const catatanHeader = ['No', 'Nama Siswa', 'NIS', 'Tanggal', 'Status', 'Keterangan']
            const catatanRows = catatan.map((c, i) => [
                i + 1,
                c.nama,
                c.nis,
                new Date(c.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
                STATUS[c.status]?.label ?? c.status,
                c.keterangan ?? '',
            ])

            const ws2Data = [['KETERANGAN ABSENSI'], [], catatanHeader, ...catatanRows]
            const ws2 = XLSX.utils.aoa_to_sheet(ws2Data)

            ws2['!cols'] = calcColWidths([catatanHeader, ...catatanRows])
            ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: catatanHeader.length - 1 } }]

            // Title
            setStyle(ws2, 0, 0, makeStyle({ bold: true, bg: '4F46E5', color: 'FFFFFF', align: 'center', size: 14 }))

            // Header (row 2)
            catatanHeader.forEach((_, c) => {
                setStyle(ws2, 2, c, makeStyle({ bold: true, bg: '1E293B', color: 'FFFFFF', align: 'center' }))
            })

            // Data (row 3+)
            catatanRows.forEach((row, ri) => {
                row.forEach((_, ci) => {
                    setStyle(ws2, 3 + ri, ci, makeStyle({
                        align: ci === 1 || ci === 5 ? 'left' : 'center',
                        bg: ri % 2 === 0 ? 'FFFFFF' : 'F9FAFB',
                    }))
                })
            })

            XLSX.utils.book_append_sheet(wb, ws2, 'Keterangan Absensi')
        }

        XLSX.writeFile(wb, `${fileName}.xlsx`)

    } catch (err) {
        console.error('[ExportExcel]', err)
        errorMsg.value = `Gagal mengekspor: ${err.message ?? 'Unknown error'}`
    } finally {
        exporting.value = false
    }
}
</script>

<template>
    <div class="inline-flex flex-col items-end gap-1">
        <button @click="handleExport" :disabled="exporting"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <svg v-if="exporting" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span v-else>📊</span>
            <span class="hidden sm:inline">{{ exporting ? 'Mengekspor…' : 'Excel' }}</span>
        </button>
        <p v-if="errorMsg" class="text-[10px] text-rose-500 max-w-[160px] text-right">{{ errorMsg }}</p>
    </div>
</template>