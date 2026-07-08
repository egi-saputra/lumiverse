<?php

   namespace App\Http\Middleware;

   use Closure;
   use Illuminate\Http\Request;
   use Symfony\Component\HttpFoundation\Response;

   class AllowExambro
   {
       public function handle(Request $request, Closure $next): Response
       {
           $response = $next($request);

           // Alih-alih menghapus, kita ubah agar mendukung WebView/Exambro
           // Ini menjaga agar browser biasa (Chrome/Safari) tetap bekerja dengan normal
           if (method_exists($response, 'header')) {
               $response->header('X-Frame-Options', 'ALLOW-FROM ALL');
           }

           return $response;
       }
   }