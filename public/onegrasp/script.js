// Preloader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hide'), 600);
});

// Scroll progress
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  document.getElementById('scroll-progress').style.width = p + '%';
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

// Cursor glow
document.addEventListener('mousemove', e => {
  const c = document.getElementById('cursor-glow');
  c.style.left = e.clientX + 'px';
  c.style.top = e.clientY + 'px';
});

// Particles
const pBox = document.getElementById('particles');
for (let i = 0; i < 24; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = 8 + Math.random() * 12 + 's';
  p.style.animationDelay = -Math.random() * 12 + 's';
  p.style.opacity = 0.2 + Math.random() * 0.5;
  p.style.transform = `scale(${0.4 + Math.random() * 1.4})`;
  pBox.appendChild(p);
}

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counter
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = 1;
      const target = +e.target.dataset.count;
      let cur = 0;
      const step = target / 60;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        e.target.textContent = Math.round(cur) + '+';
      }, 25);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// Countdown
const target = new Date();
target.setDate(target.getDate() + 2);
target.setHours(target.getHours() + 6);
function tick() {
  const diff = target - new Date();
  if (diff <= 0) return;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  document.getElementById('countdown').textContent = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(tick, 1000); tick();

// Seats decreasing
let seats = 23;
setInterval(() => {
  if (Math.random() > 0.7 && seats > 5) {
    seats--;
    document.getElementById('seats-left').textContent = seats;
    const s2 = document.getElementById('seats-left-2');
    if (s2) s2.textContent = seats;
  }
}, 18000);

// Modal
function openRegister(){ document.getElementById('modal').classList.add('open'); }
function closeRegister(){ document.getElementById('modal').classList.remove('open'); }
window.openRegister = openRegister; window.closeRegister = closeRegister;

function submitForm(e){
  e.preventDefault();
  toast('✓ Registered! Complete payment to confirm your seat.');
  setTimeout(payNow, 800);
}
window.submitForm = submitForm;

// Razorpay
function payNow(){
  if (typeof Razorpay === 'undefined'){ toast('⚠️ Loading payment gateway...'); return; }
  const options = {
    key: "YOUR_KEY",
    amount: "1800000",
    currency: "INR",
    name: "OneGrasp Startup Bootcamp",
    description: "3-Day Bootcamp Registration",
    image: "https://onegrasp.com/favicon.ico",
    theme: { color: "#DB3433" },
    handler: function(r){ toast('🎉 Payment success! ID: ' + r.razorpay_payment_id); },
    modal: { ondismiss: () => toast('Payment cancelled') }
  };
  try { new Razorpay(options).open(); }
  catch(e){ toast('Demo mode — connect your Razorpay key.'); }
}
window.payNow = payNow;

// Lightbox
function openLightbox(src){
  document.getElementById('lbImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}
window.openLightbox = openLightbox;

// Testimonials slider
const track = document.getElementById('tTrack');
const dots = document.getElementById('tDots');
const cards = track.children.length;
let idx = 0;
for (let i = 0; i < cards; i++){
  const d = document.createElement('span');
  d.onclick = () => goSlide(i);
  dots.appendChild(d);
}
function goSlide(i){
  idx = i;
  const w = track.firstElementChild.offsetWidth + 20;
  track.style.transform = `translateX(-${i * w}px)`;
  [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
}
goSlide(0);
setInterval(() => goSlide((idx + 1) % cards), 5000);

// Toasts
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 4500);
}
window.toast = toast;

// Urgency popups
const urgency = [
  '⚡ 17 students registered today',
  '⏳ Registration closes in 2 days',
  '🔥 Seats filling fast — only ' + seats + ' left',
  '🎯 Someone from Hyderabad just registered',
  '💼 IIM mentor session added'
];
let uIdx = 0;
setTimeout(function loop(){
  toast(urgency[uIdx % urgency.length]);
  uIdx++;
  setTimeout(loop, 12000 + Math.random() * 10000);
}, 5000);

// ESC closes modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ closeRegister(); document.getElementById('lightbox').classList.remove('open'); }
});
