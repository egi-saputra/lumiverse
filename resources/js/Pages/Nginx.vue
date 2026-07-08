<template>
    <div class="nginx-default">
        <div class="content">
            <h1>Welcome to nginx!</h1>

            <p>
                If you see this page, the nginx web server is successfully installed and
                working. Further configuration is required.
            </p>

            <p>
                For online documentation and support please refer to
                <a href="http://nginx.org/" target="_blank">nginx.org</a>.<br />
                Commercial support is available at
                <a href="http://nginx.com/" target="_blank">nginx.com</a>.
            </p>

            <p>
                <em>Thank you for using nginx.</em>
            </p>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.nginx-default {
    width: 100%;
    min-height: 100vh;
    background: #ffffff;
    color: #000000;
    font-family: Tahoma, Verdana, Arial, sans-serif;
}

.content {
    max-width: 35em;
    margin: 0 auto;
    padding-top: 40px;
    padding: 40px 20px;
}

h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
}

p {
    margin: 1em 0;
    line-height: 1.4;
}

a {
    color: #0000ee;
    text-decoration: underline;
}

a:visited {
    color: #551a8b;
}
</style>