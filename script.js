/* ==========================================================================
   SORRISO PRIME — script.js
   Organizado por funcionalidade. Nenhum dado é enviado a servidores externos.
   ========================================================================== */

// Número de WhatsApp da clínica (substituir pelo número real)
const whatsappNumber = "5547999999999";

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavOnScroll();
  initBackToTop();
  initWhatsappButtons();
  initFaqAccordion();
  initTestimonialSlider();
  initScrollAnimations();
  initStatsCounter();
  initContactForm();
  initFooterYear();
});

/* --------------------------------------------------------------------------
   1. HEADER — efeito ao rolar a página
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById("header");

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MENU MOBILE — abrir/fechar com animação
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  const overlay = document.getElementById("navOverlay");
  const navLinks = nav.querySelectorAll(".nav__link");

  function openMenu() {
    nav.classList.add("active");
    overlay.classList.add("active");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    nav.classList.remove("active");
    overlay.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    const isActive = nav.classList.contains("active");
    isActive ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL SUAVE para links internos
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById("header").offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. MENU — indicar seção atual durante a rolagem
   -------------------------------------------------------------------------- */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. BOTÃO VOLTAR AO TOPO
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   6. WHATSAPP — botões e função de abertura
   -------------------------------------------------------------------------- */
function openWhatsapp(message) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(url, "_blank");
}

function initWhatsappButtons() {
  const defaultMessage = "Olá! Gostaria de obter informações sobre uma consulta odontológica.";
  const scheduleMessage = "Olá! Gostaria de agendar uma consulta na Sorriso Prime.";

  const heroBtn = document.getElementById("heroWhatsapp");
  const formBtn = document.getElementById("formWhatsapp");
  const floatBtn = document.getElementById("whatsappFloat");
  const footerBtn = document.getElementById("footerWhatsapp");

  heroBtn.addEventListener("click", () => openWhatsapp(defaultMessage));
  floatBtn.addEventListener("click", () => openWhatsapp(defaultMessage));

  formBtn.addEventListener("click", () => openWhatsapp(scheduleMessage));
  footerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsapp(defaultMessage);
  });
}

/* --------------------------------------------------------------------------
   7. FAQ — accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-item__question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        otherItem.querySelector(".faq-item__question").setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. SLIDER DE DEPOIMENTOS
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.getElementById("testimonialTrack");
  const slides = track.querySelectorAll(".testimonial-slide");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const dotsContainer = document.getElementById("testimonialDots");

  let currentIndex = 0;
  let autoplayTimer = null;

  // Criar indicadores dinamicamente
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    dot.setAttribute("aria-label", `Ir para depoimento ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    restartAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 6000);
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
  });

  restartAutoplay();
}

/* --------------------------------------------------------------------------
   9. ANIMAÇÕES AO ROLAR — IntersectionObserver
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   10. CONTADOR ANIMADO DOS NÚMEROS DA CLÍNICA
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat__number");
  let hasAnimated = false;

  function animateNumber(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out
      const currentValue = Math.round(target * easedProgress);

      el.textContent = currentValue.toLocaleString("pt-BR") + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector(".stats");
  if (!statsSection) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach((el) => animateNumber(el));
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   11. FORMULÁRIO DE CONTATO — validação e envio (sem servidor externo)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("formSuccess");

  const fields = {
    nome: {
      input: document.getElementById("nome"),
      error: document.getElementById("erro-nome"),
      validate: (value) => value.trim().length >= 3,
      message: "Digite seu nome completo.",
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("erro-email"),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Digite um e-mail válido.",
    },
    telefone: {
      input: document.getElementById("telefone"),
      error: document.getElementById("erro-telefone"),
      validate: (value) => value.replace(/\D/g, "").length >= 10,
      message: "Digite um telefone válido com DDD.",
    },
    tratamento: {
      input: document.getElementById("tratamento"),
      error: document.getElementById("erro-tratamento"),
      validate: (value) => value !== "",
      message: "Selecione um tipo de atendimento.",
    },
    data: {
      input: document.getElementById("data"),
      error: document.getElementById("erro-data"),
      validate: (value) => value !== "",
      message: "Selecione uma data desejada.",
    },
    mensagem: {
      input: document.getElementById("mensagem"),
      error: document.getElementById("erro-mensagem"),
      validate: (value) => value.trim().length >= 5,
      message: "Escreva uma mensagem com pelo menos 5 caracteres.",
    },
  };

  function validateField(field) {
    const value = field.input.value;
    const isValid = field.validate(value);
    const group = field.input.closest(".form-group");

    if (!isValid) {
      group.classList.add("has-error");
      field.error.textContent = field.message;
    } else {
      group.classList.remove("has-error");
      field.error.textContent = "";
    }

    return isValid;
  }

  // Validação em tempo real ao sair do campo
  Object.values(fields).forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      const group = field.input.closest(".form-group");
      if (group.classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;
    Object.values(fields).forEach((field) => {
      const valid = validateField(field);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      successMessage.classList.remove("visible");
      return;
    }

    // Nenhum dado é enviado para servidores externos — projeto apenas frontend
    successMessage.classList.add("visible");
    form.reset();

    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

    // Esconde a mensagem de sucesso após alguns segundos
    setTimeout(() => {
      successMessage.classList.remove("visible");
    }, 6000);
  });
}

/* --------------------------------------------------------------------------
   12. ANO AUTOMÁTICO NO FOOTER
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById("currentYear");
  yearEl.textContent = new Date().getFullYear();
}