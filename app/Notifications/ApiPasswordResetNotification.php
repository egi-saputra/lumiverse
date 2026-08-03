<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApiPasswordResetNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $token)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        // Catatan: notifikasi ini saat ini cuma dipakai oleh guard 'partner'.
        // Kalau nanti dipakai ulang buat guard lain (users/owner/dst), ganti
        // baris route() di bawah supaya sesuai frontend masing-masing.
        $resetUrl = route('partner.reset-password', [
            'token' => $this->token,
            'email' => $notifiable->email,
        ]);

        return (new MailMessage)
            ->subject('Instruksi reset password Lumiverse')
            ->greeting('Halo ' . ($notifiable->name ?? ''))
            ->line('Kami menerima permintaan untuk mengatur ulang password akun Anda.')
            ->action('Reset Password', $resetUrl)
            ->line('Atau gunakan token berikut secara manual pada aplikasi / client API reset password:')
            ->line($this->token)
            ->line('Token berlaku selama 60 menit. Jika Anda tidak meminta reset password, abaikan email ini.');
    }
}