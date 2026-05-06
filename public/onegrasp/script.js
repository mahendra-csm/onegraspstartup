const BOOTCAMP_CONFIG = {
  brochureLink: "",
  paymentLink: "https://pages.razorpay.com/pl_Sm13Yy4HElWZmG/view",
  razorpayKey: "",
  amount: 1800000,
  amountLabel: "18,000",
  phone: "919871167234",
  email: "hello@onegrasp.in",
  closingDate: "2026-05-10T23:59:59+05:30",
};

const preloader = document.getElementById("preloader");
const navbar = document.getElementById("navbar");
const modal = document.getElementById("modal");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lbImg");
const scrollProgress = document.getElementById("scroll-progress");
const countdownEl = document.getElementById("countdown");

const activityStories = [
  {
    eyebrow: "City Spotlight",
    message: "Hyderabad is the host city for this in-person founder bootcamp.",
  },
  {
    eyebrow: "City Spotlight",
    message: "Students from Pune can request the brochure early to plan the trip comfortably.",
  },
  {
    eyebrow: "Program Flow",
    message: "Day 3 ends with a founder-style pitch presentation and mentor feedback.",
  },
  {
    eyebrow: "Build Mode",
    message: "Teams move from idea discovery to validation and final pitch across 3 days.",
  },
  {
    eyebrow: "Quick Help",
    message: "WhatsApp support is available for brochure, pricing and payment questions.",
  },
];

let activityIndex = 0;

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const percent = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${percent}%`;
  }

  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  }
}

function startRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

function updateCountdown() {
  if (!countdownEl) {
    return;
  }

  const now = new Date().getTime();
  const target = new Date(BOOTCAMP_CONFIG.closingDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    countdownEl.textContent = "Offer closed";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function syncBodyLock() {
  const hasOverlayOpen =
    (modal && modal.classList.contains("open")) ||
    (lightbox && lightbox.classList.contains("open"));

  document.body.classList.toggle("modal-open", Boolean(hasOverlayOpen));
}

function toast(payload) {
  const toastRoot = document.getElementById("toasts");
  if (!toastRoot) {
    return;
  }

  const data = typeof payload === "string" ? { message: payload } : payload;
  const item = document.createElement("div");
  item.className = "toast";

  if (data.eyebrow) {
    const eyebrow = document.createElement("span");
    eyebrow.className = "toast-eyebrow";
    eyebrow.textContent = data.eyebrow;
    item.appendChild(eyebrow);
  }

  const message = document.createElement("div");
  message.className = "toast-message";
  message.textContent = data.message;
  item.appendChild(message);

  toastRoot.appendChild(item);

  window.setTimeout(() => {
    item.classList.add("out");
    window.setTimeout(() => item.remove(), 240);
  }, 3600);
}

function showActivityStory() {
  toast(activityStories[activityIndex % activityStories.length]);
  activityIndex += 1;
}

function openExternal(url) {
  const opened = window.open(url, "_blank", "noopener");
  if (!opened) {
    window.location.href = url;
  }
}

function buildWhatsAppLink(message) {
  return `https://wa.me/${BOOTCAMP_CONFIG.phone}?text=${encodeURIComponent(message)}`;
}

function openRegister() {
  if (!modal) {
    return;
  }

  modal.classList.add("open");
  syncBodyLock();
}

function closeRegister() {
  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  syncBodyLock();
}

function downloadBrochure() {
  if (BOOTCAMP_CONFIG.brochureLink) {
    openExternal(BOOTCAMP_CONFIG.brochureLink);
    return;
  }

  openExternal(
    buildWhatsAppLink(
      "Hi OneGrasp, please share the Startup Bootcamp brochure."
    )
  );
  toast({ eyebrow: "Brochure", message: "Opening WhatsApp to request the brochure." });
}

function payNow() {
  if (BOOTCAMP_CONFIG.paymentLink) {
    openExternal(BOOTCAMP_CONFIG.paymentLink);
    return;
  }

  if (
    typeof Razorpay !== "undefined" &&
    BOOTCAMP_CONFIG.razorpayKey &&
    BOOTCAMP_CONFIG.razorpayKey !== "YOUR_KEY"
  ) {
    const options = {
      key: BOOTCAMP_CONFIG.razorpayKey,
      amount: String(BOOTCAMP_CONFIG.amount),
      currency: "INR",
      name: "OneGrasp Startup Bootcamp",
      description: "3-Day Bootcamp Registration",
      image: "https://onegrasp.com/wp-content/uploads/2025/03/OneGrasp-logo.png",
      theme: { color: "#DB3433" },
      handler(response) {
        toast({
          eyebrow: "Payment",
          message: `Payment successful: ${response.razorpay_payment_id}`,
        });
      },
      modal: {
        ondismiss() {
          toast({ eyebrow: "Payment", message: "Payment window closed." });
        },
      },
    };

    try {
      new Razorpay(options).open();
      return;
    } catch (error) {
      toast({
        eyebrow: "Payment",
        message: "Checkout could not open. Redirecting to WhatsApp support.",
      });
    }
  }

  openExternal(
    buildWhatsAppLink(
      "Hi OneGrasp, I want to secure my seat for the Startup Bootcamp. Please share the payment link."
    )
  );
  toast({
    eyebrow: "Payment Help",
    message: "Opening WhatsApp for payment support.",
  });
}

function submitForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const message = [
    "Hi OneGrasp, I would like to register for the Startup Bootcamp.",
    "",
    `Name: ${formData.get("name") || ""}`,
    `Phone: ${formData.get("phone") || ""}`,
    `Email: ${formData.get("email") || ""}`,
    `Age: ${formData.get("age") || ""}`,
    `City: ${formData.get("city") || ""}`,
    `School: ${formData.get("school") || ""}`,
  ].join("\n");

  openExternal(buildWhatsAppLink(message));
  form.reset();
  closeRegister();
  toast({
    eyebrow: "Registration",
    message: "Registration details are ready to send on WhatsApp.",
  });
}

function openLightbox(src) {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightboxImage.src = src;
  lightbox.classList.add("open");
  syncBodyLock();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("open");
  lightboxImage.src = "";
  syncBodyLock();
}

window.openRegister = openRegister;
window.closeRegister = closeRegister;
window.downloadBrochure = downloadBrochure;
window.payNow = payNow;
window.submitForm = submitForm;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.toast = toast;

window.addEventListener("load", () => {
  updateCountdown();
  handleScroll();
  startRevealAnimations();

  if (preloader) {
    window.setTimeout(() => preloader.classList.add("hide"), 350);
  }

  window.setTimeout(showActivityStory, 4200);
  window.setInterval(showActivityStory, 14000);
});

window.addEventListener("scroll", handleScroll, { passive: true });
window.setInterval(updateCountdown, 1000);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRegister();
    closeLightbox();
  }
});
