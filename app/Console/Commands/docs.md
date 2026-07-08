Membersihkan tabel riwayat ujian:
php artisan reset:ujian

Membersihkan tabel riwayat ujian dan ujian siswa:
php artisan reset:ujian-siswa

Membersihkan seluruh tabel, kecuali tabel users:
php artisan reset:except-users

Aktifkan Cron job di server production

* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
