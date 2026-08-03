<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Kode verifikasi 6 digit untuk alur login/daftar tanpa password di
 * Login.vue (step 'email' -> 'code'). Dipakai untuk dua kasus sekaligus:
 * - Email sudah terdaftar  -> kode ini buat login (passwordless).
 * - Email belum terdaftar  -> kode ini buat verifikasi kepemilikan email
 *   sebelum akun baru dibuat oleh AuthController::verifyLoginCode().
 *
 * $notifiable bisa berupa instance Partner ATAU AnonymousNotifiable
 * (Notification::route('mail', $email)) kalau emailnya belum terdaftar
 * sebagai Partner sama sekali.
 */
class PartnerLoginCodeNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $code)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kode verifikasi login Lumiverse Partner')
            ->greeting('Halo!')
            ->line('Gunakan kode berikut untuk masuk ke akun partner Lumiverse kamu:')
            ->line('**' . $this->code . '**')
            ->line('Kode berlaku selama 10 menit. Jika kamu tidak meminta kode ini, abaikan email ini.');
    }
}