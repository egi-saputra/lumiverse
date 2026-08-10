# Catatan Integrasi Fitur Jurnal Mengajar Guru

## 1. Route

Route resource-nya **sudah ada** di `routes/guru.php` kamu:

```php
Route::resource('/journal', JournalController::class);
```

Ini otomatis menghasilkan:
| Method | URL | Name |
|--------|----------------------------|-----------------------|
| GET | guru/journal | guru.journal.index |
| GET | guru/journal/create | guru.journal.create |
| POST | guru/journal | guru.journal.store |
| GET | guru/journal/{journal}/edit | guru.journal.edit |
| PUT | guru/journal/{journal} | guru.journal.update |
| DELETE | guru/journal/{journal} | guru.journal.destroy |

Tidak perlu ubah apa-apa di file route — controller yang dibuat sudah cocok dengan resource ini.
Kalau mau tampilkan menu di dashboard guru, tambahkan item baru ke `menuItems` di halaman dashboard, contoh:

```js
{
    title: 'Jurnal Mengajar',
    icon: BookOpenIcon, // import dari @heroicons/vue/24/solid
    route: route('guru.journal.index'),
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20'
},
```

## 2. Tambahkan relasi `journal()` ke model yang sudah ada

**app/Models/Guru.php**

```php
public function journal()
{
    return $this->hasMany(Journal::class, 'guru_id');
}
```

**app/Models/Kelas.php**

```php
public function journal()
{
    return $this->hasMany(Journal::class, 'kelas_id');
}
```

**app/Models/Mapel.php**

```php
public function journal()
{
    return $this->hasMany(Journal::class, 'mapel_id');
}
```

## 3. Jalankan migrasi

```bash
php artisan migrate
```

## 4. Cara kerja fitur

- Guru login → menu "Jurnal Mengajar" → tekan **Isi Jurnal**.
- Form berisi: tanggal (default hari ini), jam mulai (default jam sekarang), jam selesai (opsional), kelas, mata pelajaran, dan materi yang diajarkan.
- Data disimpan dengan `guru_id` otomatis dari user yang login (`auth()->user()->guru`), jadi guru **tidak bisa mengedit/menghapus** jurnal milik guru lain (dicek di `authorizeJournal()`).
- Kombinasi guru + kelas + mapel + tanggal + jam_mulai dibuat **unique** di migrasi, supaya tidak ada entri ganda untuk sesi mengajar yang sama.
- Index mendukung pencarian materi dan filter per tanggal.

## 5. Asumsi yang perlu dicek ulang

- Relasi `User -> Guru` diasumsikan bernama `guru` (dipakai sebagai `Auth::user()->guru`). Sesuaikan kalau nama relasinya beda.
- Dropdown **kelas** masih menampilkan semua kelas (belum difilter per guru) — kalau ini juga perlu dibatasi, tinggal bilang.

## 6. Update terbaru — aturan jam & anti-spam

**Tanggal & jam sekarang full dikontrol server, bukan input user:**

- Saat guru buka halaman "Isi Jurnal", server mengirim `serverTime` (tanggal, jam_mulai = sekarang, jam_selesai = sekarang + 90 menit). Front-end hanya menampilkan (readonly), tidak bisa diubah.
- Saat submit, controller **mengabaikan** tanggal/jam yang dikirim dari client dan menghitung ulang dari `Carbon::now()` di server — jadi tidak bisa dimanipulasi lewat request langsung (mis. Postman).

**Dropdown Mapel** sekarang difilter: `Mapel::where('guru_id', $guru->id)`, jadi guru cuma lihat mapel yang memang diampu dia. Validasi `mapel_id` di `store()`/`update()` juga dicek harus milik guru tsb (`Rule::exists('mapel','id')->where('guru_id', $guru->id)`), jadi tidak bisa disusupi lewat request manual.

**Batas jam 14:00**: method `create()` & `store()` sama-sama menolak (redirect ke index dengan pesan error) kalau jam sekarang >= 14:00. Dicek dua kali (waktu buka halaman & waktu submit) untuk jaga-jaga kalau guru buka halaman sebelum jam 14:00 tapi baru submit setelahnya.

**Anti-spam sesi berjalan**: sebelum guru bisa isi jurnal baru, dicek apakah ada jurnal hari itu yang `jam_selesai`-nya masih lebih besar dari jam sekarang (`sesiMasihBerlangsung()`). Kalau ada, guru diarahkan balik ke index dengan pesan "baru bisa isi jurnal setelah sesi sebelumnya selesai pukul ...".

**Penting — cek `HandleInertiaRequests`**: pastikan middleware share props kamu mengirim `flash.error`, bukan cuma `flash.success`. Kalau strukturnya seperti ini, sudah aman:

```php
'flash' => [
    'success' => fn () => $request->session()->get('success'),
    'error'   => fn () => $request->session()->get('error'),
],
```

Kalau cuma `success` yang di-share, tambahkan baris `error` supaya pesan penolakan (jam ditutup / sesi masih berjalan) muncul di halaman index.

## 7. Badge status di Dashboard (bukan menu terpisah lagi)

Tombol "Isi Jurnal" sekarang digabung jadi satu pill/badge di dalam hero **Welcome card** di dashboard, bukan item grid menu lagi:

- **Biru (Open)** — bisa diklik, langsung ke `guru.journal.create`, muncul panah kecil di kanan.
- **Merah (Closed)** — tidak bisa diklik (`cursor-not-allowed`), ada ikon gembok, dan teks status ("Buka pukul 06:00" / "Ditutup, buka lagi besok pukul 06:00").

Status ini didapat dari **shared Inertia prop** `journal`, bukan dihitung di JavaScript, supaya jam yang dipakai selalu jam server (WIB) — konsisten dengan validasi di `JournalController`.

**File baru yang ditambahkan:**

- `app/Support/JournalWindow.php` — satu-satunya sumber kebenaran untuk jam buka/tutup (06:00–14:00) & durasi sesi (90 menit). `JournalController` sekarang juga refactor untuk memakai class ini (tidak ada lagi konstanta duplikat).
- `app/Http/Middleware/SNIPPET-HandleInertiaRequests.php` — **ini bukan file utuh**, cuma potongan kode yang perlu kamu tambahkan secara manual ke method `share()` di `app/Http/Middleware/HandleInertiaRequests.php` milikmu yang sudah ada. Intinya menambahkan key `'journal'` yang isinya `JournalWindow::toArray()`, tapi cuma untuk user yang punya relasi `guru`.

**Langkah yang wajib kamu lakukan manual:**

1. Buka `app/Http/Middleware/HandleInertiaRequests.php` kamu yang asli.
2. Di method `share()`, tambahkan key `'journal'` seperti contoh di `SNIPPET-HandleInertiaRequests.php` (jangan hapus props lain yang sudah ada, cuma tambahkan).
3. Import `use App\Support\JournalWindow;` dan `use Illuminate\Support\Facades\Auth;` (kalau belum ada) di bagian atas file.

Kalau prop `journal` belum ada di shared props, badge di dashboard akan otomatis fallback ke status "Closed" (aman, tidak error) — tapi tentu belum akurat sampai step di atas kamu lakukan.

## 8. Menu grid mobile

Item "Journal" sudah dihapus dari `menuItems` di `Dashboard.vue` karena sekarang aksesnya lewat badge di hero card, bukan grid menu lagi.
