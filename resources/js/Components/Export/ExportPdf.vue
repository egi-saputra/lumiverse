<script setup>
/**
 * ExportPdf.vue
 *
 * Render tabel MANUAL menggunakan jsPDF primitives (rect + text).
 * ZERO dependency pada jspdf-autotable — tidak ada plugin, tidak ada bug.
 *
 * Strategi:
 *  - Setiap baris dihitung tingginya secara manual.
 *  - Jika baris berikutnya melebihi batas halaman → addPage() otomatis.
 *  - Warna background cell digambar dulu (rect 'F'), baru teks di atasnya.
 */
import { ref } from 'vue'
import { jsPDF } from 'jspdf'

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Truncate string agar muat di lebar kolom tertentu (estimasi ~1.7 pt/char). */
function truncate(doc, str, maxW) {
    str = String(str ?? '')
    if (doc.getTextWidth(str) <= maxW) return str
    while (str.length > 1 && doc.getTextWidth(str + '…') > maxW) {
        str = str.slice(0, -1)
    }
    return str + '…'
}

/**
 * Gambar satu baris tabel.
 * @param {jsPDF} doc
 * @param {number} y       - posisi Y atas baris
 * @param {Array}  cells   - [{ text, w, align, bgRGB, fgRGB, bold }]
 * @param {number} rowH    - tinggi baris
 * @param {number} startX  - X awal
 * @param {number} fontSize
 */
function drawRow(doc, y, cells, rowH, startX, fontSize) {
    let x = startX
    for (const cell of cells) {
        // Background
        if (cell.bgRGB) {
            doc.setFillColor(...cell.bgRGB)
            doc.rect(x, y, cell.w, rowH, 'F')
        }
        // Border kanan tipis
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.15)
        doc.rect(x, y, cell.w, rowH, 'S')

        // Teks
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', cell.bold ? 'bold' : 'normal')
        doc.setTextColor(...(cell.fgRGB ?? [30, 41, 59]))

        const pad = 1.5
        const textY = y + rowH / 2 + fontSize * 0.35   // vertikal center kasar
        const maxW = cell.w - pad * 2
        const txt = truncate(doc, cell.text, maxW)

        let textX
        if (cell.align === 'center') {
            textX = x + cell.w / 2
            doc.text(txt, textX, textY, { align: 'center' })
        } else if (cell.align === 'right') {
            textX = x + cell.w - pad
            doc.text(txt, textX, textY, { align: 'right' })
        } else {
            textX = x + pad
            doc.text(txt, textX, textY, { align: 'left' })
        }
        x += cell.w
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
function handleExport() {
    exporting.value = true
    errorMsg.value = ''

    try {
        // Snapshot props → plain JS (hindari reaktivitas Vue saat render)
        const kelas = JSON.parse(JSON.stringify(props.kelas ?? {}))
        const label = String(props.label ?? '')
        const hariEfektif = JSON.parse(JSON.stringify(props.hariEfektif ?? []))
        const siswa = JSON.parse(JSON.stringify(props.siswa ?? []))
        const rekap = JSON.parse(JSON.stringify(props.rekapKelas ?? {}))
        const avgKeh = props.avgKehadiran
        const catatan = JSON.parse(JSON.stringify(props.allCatatan ?? []))

        // ── Dokumen ─────────────────────────────────────────────
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
        const pageW = doc.internal.pageSize.getWidth()   // 297
        const pageH = doc.internal.pageSize.getHeight()  // 210
        const M = 10   // margin kiri-kanan

        // Palet warna
        const C = {
            dark: [30, 41, 59],
            accent: [79, 70, 229],
            muted: [100, 116, 139],
            border: [226, 232, 240],
            bg: [248, 250, 252],
            white: [255, 255, 255],
            altRow: [243, 244, 246],
            hBg: [209, 250, 229], hTx: [6, 95, 70],
            sBg: [254, 243, 199], sTx: [120, 53, 15],
            iBg: [224, 242, 254], iTx: [7, 89, 133],
            aBg: [255, 228, 230], aTx: [159, 18, 57],
        }

        // ── Chrome halaman ───────────────────────────────────────
        function drawPageChrome() {
            doc.setFillColor(...C.bg)
            doc.rect(0, 0, pageW, pageH, 'F')
            doc.setFillColor(...C.accent)
            doc.rect(0, 0, pageW, 1.8, 'F')
            doc.rect(0, pageH - 1.8, pageW, 1.8, 'F')
        }

        function drawFooter(pg, suffix) {
            doc.setFontSize(7)
            doc.setTextColor(...C.muted)
            doc.setFont('helvetica', 'normal')
            doc.text(
                `Halaman ${pg}  ·  ${suffix}`,
                pageW / 2, pageH - 4, { align: 'center' }
            )
        }

        // ════════════════════════════════════════════════════════
        // HALAMAN 1 — Header + summary cards + tabel rekap
        // ════════════════════════════════════════════════════════
        drawPageChrome()

        // Header card
        doc.setFillColor(...C.white)
        doc.roundedRect(M, 5, pageW - M * 2, 22, 2, 2, 'F')
        doc.setDrawColor(...C.border)
        doc.roundedRect(M, 5, pageW - M * 2, 22, 2, 2, 'S')
        doc.setFillColor(...C.accent)
        doc.roundedRect(M, 5, 3, 22, 1, 1, 'F')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(...C.dark)
        doc.text('REKAP ABSENSI SISWA', M + 7, 13)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7.5)
        doc.setTextColor(...C.muted)
        doc.text(`Kelas: ${kelas.kelas ?? ''}`, M + 7, 19)
        doc.text(`Wali Kelas: ${kelas.guru_nama ?? ''}`, M + 7, 23.5)
        doc.text(`Periode: ${label}`, pageW / 2, 19)
        doc.text(
            `Dicetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`,
            pageW / 2, 23.5
        )

        // Summary cards
        const cardY = 30.5
        const cardW = (pageW - M * 2 - 5 * 2) / 6
        const cardH = 12
        const summaryCards = [
            { label: 'Hari Efektif', val: String(rekap.hari_efektif ?? '—'), col: C.dark },
            { label: 'Hadir', val: String(rekap.total_hadir ?? '—'), col: C.hTx },
            { label: 'Sakit', val: String(rekap.total_sakit ?? '—'), col: C.sTx },
            { label: 'Izin', val: String(rekap.total_izin ?? '—'), col: C.iTx },
            { label: 'Alpha', val: String(rekap.total_alpha ?? '—'), col: C.aTx },
            { label: 'Rata-rata', val: avgKeh !== null ? `${avgKeh}%` : '—', col: C.accent },
        ]
        summaryCards.forEach((card, i) => {
            const cx = M + i * (cardW + 2)
            doc.setFillColor(...C.white)
            doc.roundedRect(cx, cardY, cardW, cardH, 2, 2, 'F')
            doc.setDrawColor(...C.border)
            doc.roundedRect(cx, cardY, cardW, cardH, 2, 2, 'S')
            doc.setFillColor(...card.col)
            doc.roundedRect(cx, cardY, 2.5, cardH, 1, 1, 'F')
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(10)
            doc.setTextColor(...card.col)
            doc.text(card.val, cx + cardW / 2 + 1.2, cardY + 6, { align: 'center' })
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(5.5)
            doc.setTextColor(...C.muted)
            doc.text(card.label, cx + cardW / 2 + 1.2, cardY + 10, { align: 'center' })
        })

        // ── Definisi kolom tabel ─────────────────────────────────
        // Kolom tetap: No(6) Nama(36) NIS(15) H(7) S(7) I(7) A(7) %(11)
        // Kolom tanggal: sisanya dibagi rata, min 6 mm
        const fixedW = 6 + 36 + 15 + 7 + 7 + 7 + 7 + 11   // = 96
        const tableW = pageW - M * 2
        const dateCount = hariEfektif.length
        const dateColW = dateCount > 0
            ? Math.max(6, Math.min(10, (tableW - fixedW) / dateCount))
            : 8

        // Jika total melebihi tableW, kecilkan nama
        // const namaW = Math.max(24, tableW - (fixedW - 36) - dateColW * dateCount)
        const namaW = Math.min(
            50, // maksimal lebar nama
            Math.max(
                24,
                tableW - (fixedW - 36) - dateColW * dateCount
            )
        )

        const COL_WIDTHS = [6, namaW, 15, 7, 7, 7, 7, 11, ...Array(dateCount).fill(dateColW)]

        const ROW_H = 6.5    // tinggi baris data
        const HEAD_H = 8      // tinggi baris header
        const FONT_DATA = 6.5
        const FONT_HEAD = 6

        // Batas Y bawah sebelum addPage
        const bottomLimit = pageH - 8

        // ── Header tabel ─────────────────────────────────────────
        let curY = cardY + cardH + 3

        function drawTableHeader(y) {
            const dateHdrs = hariEfektif.map(tgl => {
                const d = new Date(tgl)
                // return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                return d.toLocaleDateString('id-ID', { day: '2-digit' })
            })
            const headers = ['No', 'Nama Siswa', 'NIS', 'H', 'S', 'I', 'A', '%', ...dateHdrs]
            const headCells = headers.map((h, i) => ({
                text: h,
                w: COL_WIDTHS[i],
                align: i === 1 ? 'left' : 'center',
                bgRGB: C.dark,
                fgRGB: [255, 255, 255],
                bold: true,
            }))
            drawRow(doc, y, headCells, HEAD_H, M, FONT_HEAD)
            return y + HEAD_H
        }

        let pageNum = 1
        curY = drawTableHeader(curY)

        // ── Baris data ───────────────────────────────────────────
        const footerText =
            `Data Rekap Absensi Kelas ${kelas.kelas ?? ''} – ${label} | Powered by KreatiCraft Indonesia`

        siswa.forEach((s, idx) => {
            if (curY + ROW_H > bottomLimit) {
                drawFooter(pageNum, footerText)
                doc.addPage()
                pageNum++
                drawPageChrome()
                curY = 8
                curY = drawTableHeader(curY)
            }

            const isAlt = idx % 2 === 1
            const rowBg = isAlt ? C.altRow : C.white

            const pct = s.pct_kehadiran
            const pctTxt = pct !== null && pct !== undefined ? `${pct}%` : '—'
            let pctFg = C.muted
            if (pct !== null && pct !== undefined) {
                if (pct >= 80) pctFg = C.hTx
                else if (pct >= 60) pctFg = [154, 52, 18]
                else pctFg = C.aTx
            }

            const dateCells = hariEfektif.map(tgl => {
                const det = s.detail?.find(d => d.tanggal === tgl)
                if (!det) return { text: '', w: dateColW, align: 'center', bgRGB: rowBg, fgRGB: C.muted }
                const st = det.status
                const bgMap = { hadir: C.hBg, sakit: C.sBg, izin: C.iBg, alpha: C.aBg }
                const fgMap = { hadir: C.hTx, sakit: C.sTx, izin: C.iTx, alpha: C.aTx }
                return {
                    text: STATUS[st]?.short ?? '',
                    w: dateColW,
                    align: 'center',
                    bgRGB: bgMap[st] ?? rowBg,
                    fgRGB: fgMap[st] ?? C.dark,
                    bold: true,
                }
            })

            const rowCells = [
                { text: idx + 1, w: COL_WIDTHS[0], align: 'center', bgRGB: rowBg, fgRGB: C.muted },
                { text: s.nama_lengkap, w: COL_WIDTHS[1], align: 'left', bgRGB: rowBg, fgRGB: C.dark, bold: true },
                { text: s.nis, w: COL_WIDTHS[2], align: 'center', bgRGB: rowBg, fgRGB: C.muted },
                { text: s.counts.hadir, w: COL_WIDTHS[3], align: 'center', bgRGB: C.hBg, fgRGB: C.hTx, bold: true },
                { text: s.counts.sakit, w: COL_WIDTHS[4], align: 'center', bgRGB: C.sBg, fgRGB: C.sTx, bold: true },
                { text: s.counts.izin, w: COL_WIDTHS[5], align: 'center', bgRGB: C.iBg, fgRGB: C.iTx, bold: true },
                { text: s.counts.alpha, w: COL_WIDTHS[6], align: 'center', bgRGB: C.aBg, fgRGB: C.aTx, bold: true },
                { text: pctTxt, w: COL_WIDTHS[7], align: 'center', bgRGB: rowBg, fgRGB: pctFg, bold: true },
                ...dateCells,
            ]

            drawRow(doc, curY, rowCells, ROW_H, M, FONT_DATA)
            curY += ROW_H
        })

        drawFooter(pageNum, footerText)

        // ════════════════════════════════════════════════════════
        // HALAMAN 2 (opsional) — Keterangan Absensi
        // ════════════════════════════════════════════════════════
        if (catatan.length) {
            doc.addPage()
            pageNum++
            drawPageChrome()

            // Sub-header
            doc.setFillColor(...C.white)
            doc.roundedRect(M, 5, pageW - M * 2, 15, 2, 2, 'F')
            doc.setDrawColor(...C.border)
            doc.roundedRect(M, 5, pageW - M * 2, 15, 2, 2, 'S')
            doc.setFillColor(...C.accent)
            doc.roundedRect(M, 5, 3, 15, 1, 1, 'F')
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(11)
            doc.setTextColor(...C.dark)
            doc.text('KETERANGAN ABSENSI', M + 7, 11)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(7.5)
            doc.setTextColor(...C.muted)
            doc.text(`${kelas.kelas ?? ''} – ${label}`, M + 7, 16.5)

            // Kolom: No(8) Nama(55) NIS(22) Tanggal(38) Status(20) Keterangan(sisa)
            const C2 = [8, 55, 22, 38, 20]
            const ketW = tableW - C2.reduce((a, b) => a + b, 0)
            const cols2 = [...C2, Math.max(20, ketW)]

            const ROW_H2 = 7
            let cy2 = 25

            // Header
            const h2Labels = ['No', 'Nama Siswa', 'NIS', 'Tanggal', 'Status', 'Keterangan']
            const h2Cells = h2Labels.map((h, i) => ({
                text: h, w: cols2[i], align: i === 1 || i === 5 ? 'left' : 'center',
                bgRGB: C.dark, fgRGB: [255, 255, 255], bold: true,
            }))
            drawRow(doc, cy2, h2Cells, 8, M, 7)
            cy2 += 8

            let pg2 = pageNum
            catatan.forEach((c, i) => {
                if (cy2 + ROW_H2 > bottomLimit) {
                    drawFooter(pg2, `Keterangan – ${kelas.kelas ?? ''}`)
                    doc.addPage()
                    pg2++
                    drawPageChrome()
                    cy2 = 10
                    drawRow(doc, cy2, h2Cells, 8, M, 7)
                    cy2 += 8
                }

                const isAlt = i % 2 === 1
                const rb = isAlt ? C.altRow : C.white
                const stLbl = STATUS[c.status]?.label ?? c.status
                const stBg = { Hadir: C.hBg, Sakit: C.sBg, Izin: C.iBg, Alpha: C.aBg }[stLbl] ?? rb
                const stFg = { Hadir: C.hTx, Sakit: C.sTx, Izin: C.iTx, Alpha: C.aTx }[stLbl] ?? C.dark
                const tglFmt = new Date(c.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

                const row2 = [
                    { text: i + 1, w: cols2[0], align: 'center', bgRGB: rb, fgRGB: C.muted },
                    { text: c.nama, w: cols2[1], align: 'left', bgRGB: rb, fgRGB: C.dark, bold: true },
                    { text: c.nis, w: cols2[2], align: 'center', bgRGB: rb, fgRGB: C.muted },
                    { text: tglFmt, w: cols2[3], align: 'center', bgRGB: rb, fgRGB: C.dark },
                    { text: stLbl, w: cols2[4], align: 'center', bgRGB: stBg, fgRGB: stFg, bold: true },
                    { text: c.keterangan ?? '', w: cols2[5], align: 'left', bgRGB: rb, fgRGB: C.dark },
                ]
                drawRow(doc, cy2, row2, ROW_H2, M, 7.5)
                cy2 += ROW_H2
            })

            drawFooter(pg2, `Keterangan – ${kelas.kelas ?? ''}`)
        }

        // ── Simpan ────────────────────────────────────────────────
        const fileName = `Rekap_Absensi_${kelas.kelas ?? 'Kelas'}_${label}`
            .replace(/\s+/g, '_')
            .replace(/[^\w-]/g, '')
        doc.save(`${fileName}.pdf`)

    } catch (err) {
        console.error('[ExportPdf]', err)
        errorMsg.value = `Gagal mengekspor: ${err.message ?? 'Unknown error'}`
    } finally {
        exporting.value = false
    }
}
</script>

<template>
    <div class="inline-flex flex-col items-end gap-1">
        <button @click="handleExport" :disabled="exporting"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <svg v-if="exporting" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span v-else>📄</span>
            <span class="hidden sm:inline">{{ exporting ? 'Mengekspor…' : 'PDF' }}</span>
        </button>
        <p v-if="errorMsg" class="text-[10px] text-rose-500 max-w-[160px] text-right">{{ errorMsg }}</p>
    </div>
</template>