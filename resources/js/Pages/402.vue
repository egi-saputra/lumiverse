<script setup>
import { Head } from '@inertiajs/vue3';
</script>

<template>

    <Head>
        <title>402 - This site has suspended and unpaid payment</title>
    </Head>

    <div class="nginx-page">
        <div class="container">
            <h1>Payment Required</h1>

            <p>
                If you see this page, the server has been temporarily suspended due to an unpaid invoice.
            </p>

            <p>
                Please complete your payment to restore service access.
            </p>

            <p>
                For support, contact your hosting provider.
            </p>

            <hr>

            <p><em>Thank you for using our services.</em></p>

            <p class="footer">
                <em>KreatiCraft Indonesia</em>
            </p>
        </div>
    </div>
</template>

<style scoped>
.nginx-page {
    background: #fff;
    color: #000;
    font-family: Tahoma, Verdana, Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    max-width: 35em;
    padding: 6px 20px;
}

h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.67em;
}

p {
    margin: 1em 0;
    line-height: 1.4;
}

hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 20px 0;
}

.footer {
    text-align: right;
}
</style>