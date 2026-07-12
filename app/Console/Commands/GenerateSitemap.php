<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate sitemap.xml untuk landing page lumiverse.co.id';

    public function handle()
    {
        // Sitemap untuk LMS
        $lms = Sitemap::create();
        $lms->add(Url::create('https://lumiverse.co.id/')->setPriority(1.0));
        $lms->writeToFile(public_path('sitemap-lms.xml'));

        // Sitemap untuk Workspace
        $workspace = Sitemap::create();
        $workspace->add(Url::create('https://workspace.lumiverse.co.id/')->setPriority(1.0));
        $workspace->writeToFile(public_path('sitemap-workspace.xml'));

        $this->info('Sitemap berhasil digenerate!');
    }
}