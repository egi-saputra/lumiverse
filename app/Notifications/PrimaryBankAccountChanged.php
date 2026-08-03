<?php

namespace App\Notifications;

use App\Models\PartnerBankAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrimaryBankAccountChanged extends Notification
{
    use Queueable;

    public function __construct(private readonly PartnerBankAccount $bankAccount)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Rekening Utama Pencairan Kamu Baru Saja Diubah')
            ->greeting('Halo,')
            ->line("Rekening {$this->bankAccount->bank_code} " . substr($this->bankAccount->account_number, -4) . " baru saja dijadikan rekening utama untuk pencairan komisi kamu.")
            ->line('Kalau ini BUKAN kamu yang melakukannya, segera hubungi support kami dan ganti password akun kamu.')
            ->line('Pencairan ke rekening baru baru bisa diproses setelah 24 jam sejak ditambahkan, jadi kamu masih punya waktu untuk melapor.');
    }
}