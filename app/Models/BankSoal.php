<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Concerns\HasTenantFileUrl;

class BankSoal extends Model
{
    use HasFactory, HasTenantFileUrl;

    protected $table = 'bank_soal';

    protected $fillable = [
        'soal_id', 'soal', 'tipe_soal', 'jenis_lampiran', 'link_lampiran',
        'jawaban_benar',
        'opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e',
        'opsi_a_lampiran', 'opsi_b_lampiran', 'opsi_c_lampiran',
        'opsi_d_lampiran', 'opsi_e_lampiran',
        'nilai',
    ];

    protected $appends = [
        'link_lampiran_url',
        'opsi_a_lampiran_url', 'opsi_b_lampiran_url', 'opsi_c_lampiran_url',
        'opsi_d_lampiran_url', 'opsi_e_lampiran_url',
    ];

    public function soal()
    {
        return $this->belongsTo(Soal::class, 'soal_id');
    }

    public function getLinkLampiranUrlAttribute(): ?string
    {
        return $this->tenantFileUrl($this->link_lampiran);
    }

    public function getOpsiALampiranUrlAttribute(): ?string { return $this->tenantFileUrl($this->opsi_a_lampiran); }
    public function getOpsiBLampiranUrlAttribute(): ?string { return $this->tenantFileUrl($this->opsi_b_lampiran); }
    public function getOpsiCLampiranUrlAttribute(): ?string { return $this->tenantFileUrl($this->opsi_c_lampiran); }
    public function getOpsiDLampiranUrlAttribute(): ?string { return $this->tenantFileUrl($this->opsi_d_lampiran); }
    public function getOpsiELampiranUrlAttribute(): ?string { return $this->tenantFileUrl($this->opsi_e_lampiran); }
}