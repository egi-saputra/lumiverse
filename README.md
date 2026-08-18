npm install markdown-it dompurify
npm install markdown-it markdown-it-texmath katex markdown-it-highlightjs highlight.js

composer require xendit/xendit-php
composer require barryvdh/laravel-dompdf
composer require predis/predis
composer dump-autoload

NODE_OPTIONS="--max-old-space-size=2560" npm run build && NODE_OPTIONS="--max-old-space-size=2560" npm run build:ssr
