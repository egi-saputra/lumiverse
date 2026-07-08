<template>
  <div class="payment-wall">
    <!-- Animated grid background -->
    <div class="grid-bg"></div>
    <div class="scanline"></div>

    <!-- Noise overlay -->
    <div class="noise"></div>

    <!-- Floating orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="container">
      <!-- Top badge -->
      <div class="badge" :class="{ visible: mounted }">
        <span class="badge-dot"></span>
        <span>SERVER STATUS</span>
      </div>

      <!-- Status code -->
      <div class="status-block" :class="{ visible: mounted }">
        <div class="status-code">
          <span class="digit" style="--i:0">4</span>
          <span class="digit" style="--i:1">0</span>
          <span class="digit" style="--i:2">2</span>
        </div>
        <div class="status-divider"></div>
        <p class="status-label">PAYMENT REQUIRED</p>
      </div>

      <!-- Main content -->
      <div class="content" :class="{ visible: mounted }">
        <h1 class="headline">
          Akses Ditangguhkan
        </h1>
        <p class="subtext">
          Layanan server Anda telah dinonaktifkan sementara.
        </p>
        <p class="subtext">
          Selesaikan pembayaran untuk mengaktifkan kembali server Anda.
        </p>
      </div>

      <!-- Info card -->
      <div class="info-card" :class="{ visible: mounted }">
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">Server ID</span>
            <span class="info-value mono">SRV-{{ serverId }}</span>
          </div>
          <div class="info-sep"></div>
          <div class="info-item">
            <span class="info-label">Jatuh Tempo</span>
            <span class="info-value urgent">{{ dueDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mounted = ref(false)

// Props or computed values — ganti sesuai data asli
const serverId = ref('7F3A2C91')
const dueDate = ref('2 JUNI 2026')

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
  }, 100)
})

const handlePay = () => {
  // Navigate to payment page
  console.log('Redirect to payment...')
}

const handleSupport = () => {
  // Open support chat / ticket
  console.log('Open support...')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.payment-wall {
  min-height: 100vh;
  width: 100%;
  background: #060810;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Syne', sans-serif;
  position: relative;
  overflow: hidden;
  color: #e8eaf0;
}

/* ─── Grid Background ─── */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 80, 80, .04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 80, 80, .04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

/* ─── Scanline ─── */
.scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(to bottom,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, .08) 3px,
      rgba(0, 0, 0, .08) 4px);
  pointer-events: none;
  z-index: 1;
}

/* ─── Noise ─── */
.noise {
  position: absolute;
  inset: -200%;
  width: 400%;
  height: 400%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: .025;
  pointer-events: none;
  z-index: 1;
}

/* ─── Orbs ─── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(220, 38, 38, .18) 0%, transparent 70%);
  top: -150px;
  left: -150px;
  animation: drift 12s ease-in-out infinite alternate;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(251, 113, 133, .1) 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
  animation: drift 15s ease-in-out infinite alternate-reverse;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, .08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-orb 8s ease-in-out infinite;
}

@keyframes drift {
  from {
    transform: translate(0, 0);
  }

  to {
    transform: translate(60px, 40px);
  }
}

@keyframes pulse-orb {

  0%,
  100% {
    opacity: .5;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* ─── Container ─── */
.container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 560px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

/* ─── Transitions ─── */
.badge,
.status-block,
.content,
.info-card,
.actions,
.footer {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .6s ease, transform .6s ease;
}

.badge.visible {
  opacity: 1;
  transform: none;
  transition-delay: .1s;
}

.status-block.visible {
  opacity: 1;
  transform: none;
  transition-delay: .25s;
}

.content.visible {
  opacity: 1;
  transform: none;
  transition-delay: .4s;
}

.info-card.visible {
  opacity: 1;
  transform: none;
  transition-delay: .55s;
}

.actions.visible {
  opacity: 1;
  transform: none;
  transition-delay: .7s;
}

.footer.visible {
  opacity: 1;
  transform: none;
  transition-delay: .85s;
}

/* ─── Badge ─── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(220, 38, 38, .3);
  border-radius: 2px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .2em;
  color: #ef4444;
  background: rgba(220, 38, 38, .06);
  text-transform: uppercase;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  animation: blink 1.4s step-end infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* ─── Status Code ─── */
.status-block {
  text-align: center;
}

.status-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  line-height: 1;
}

.digit {
  font-size: clamp(80px, 18vw, 120px);
  font-weight: 800;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(239, 68, 68, .6);
  animation: glitch-in .5s ease forwards;
  animation-delay: calc(var(--i) * .1s + .3s);
  opacity: 0;
}

@keyframes glitch-in {
  0% {
    opacity: 0;
    transform: skewX(-10deg) translateX(-8px);
  }

  60% {
    opacity: 1;
    transform: skewX(3deg) translateX(2px);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

.status-divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(239, 68, 68, .5), transparent);
  margin: 8px auto 12px;
}

.status-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .25em;
  color: rgba(239, 68, 68, .7);
  text-transform: uppercase;
}

/* ─── Content ─── */
.content {
  text-align: center;
}

.headline {
  font-size: clamp(22px, 5vw, 30px);
  font-weight: 800;
  color: #f1f2f6;
  letter-spacing: -.02em;
  line-height: 1.2;
  margin-bottom: 12px;
}

.subtext {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: rgba(232, 234, 240, .45);
  line-height: 1.7;
  max-width: 620px;
}

/* ─── Info Card ─── */
.info-card {
  width: 100%;
  background: rgba(255, 255, 255, .025);
  border: 1px solid rgba(255, 255, 255, .07);
  border-radius: 4px;
  padding: 20px 24px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(239, 68, 68, .05) 0%, transparent 60%);
  pointer-events: none;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.info-item:nth-child(2) {
  text-align: center;
}

.info-item:nth-child(3) {
  text-align: right;
}

.info-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: rgba(232, 234, 240, .3);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #e8eaf0;
}

.info-value.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.info-value.urgent {
  color: #ef4444;
}

.info-sep {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, .07);
  flex-shrink: 0;
}

/* ─── Actions ─── */
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.btn-primary {
  width: 100%;
  padding: 16px 24px;
  background: #dc2626;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .05em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  transition: background .2s, transform .15s;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, .08) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform .4s ease;
}

.btn-primary:hover::before {
  transform: translateX(100%);
}

.btn-primary:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-icon {
  display: flex;
  align-items: center;
}

.btn-arrow {
  margin-left: auto;
  font-size: 16px;
  transition: transform .2s;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-secondary {
  width: 100%;
  padding: 14px 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 3px;
  color: rgba(232, 234, 240, .5);
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .05em;
  cursor: pointer;
  transition: border-color .2s, color .2s, background .2s;
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, .25);
  color: rgba(232, 234, 240, .85);
  background: rgba(255, 255, 255, .04);
}

/* ─── Footer ─── */
.footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(232, 234, 240, .25);
  text-align: center;
  line-height: 1.6;
}

.footer-icon {
  flex-shrink: 0;
  color: rgba(232, 234, 240, .3);
}

/* ─── Responsive ─── */
@media (max-width: 480px) {
  .info-row {
    flex-direction: column;
    gap: 16px;
  }

  .info-sep {
    width: 100%;
    height: 1px;
  }

  .info-item:nth-child(2),
  .info-item:nth-child(3) {
    text-align: left;
  }
}
</style>