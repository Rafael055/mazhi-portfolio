const navLinks = document.querySelectorAll(".navbar a");
const sections = [...document.querySelectorAll("main section[id], header[id]")];
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navClose = document.querySelector(".nav-close");
const navBackdrop = document.querySelector(".nav-backdrop");

function setMobileMenu(open) {
  if (!navbar || !menuToggle || !navBackdrop) return;

  navbar.classList.toggle("is-open", open);
  navBackdrop.classList.toggle("is-visible", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
}

menuToggle?.addEventListener("click", () => setMobileMenu(true));
navClose?.addEventListener("click", () => setMobileMenu(false));
navBackdrop?.addEventListener("click", () => setMobileMenu(false));
navLinks.forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

function setActiveNavLink() {
  const scrollPosition = window.scrollY + 130;

  let currentId = "home";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
}

function closeMobileMenuOnScroll() {
  if (window.matchMedia("(max-width: 900px)").matches && navbar?.classList.contains("is-open")) {
    setMobileMenu(false);
  }
}

if (navLinks.length) {
  setActiveNavLink();
  window.addEventListener("scroll", setActiveNavLink, { passive: true });
}

window.addEventListener("scroll", closeMobileMenuOnScroll, { passive: true });

const emailLink = document.querySelector(".copy-email");
const copyStatus = document.querySelector(".copy-status");

if (emailLink && copyStatus) {
  emailLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(emailLink.dataset.email);
      copyStatus.classList.add("show");
    } catch {
      copyStatus.innerHTML =
        '<i class="fa-solid fa-triangle-exclamation"></i> Copy failed';
      copyStatus.classList.add("show");
    }

    window.setTimeout(() => {
      copyStatus.classList.remove("show");
    }, 2000);
  });
}

const projectData = {
  potatoliz: {
    title: "PotatoLiz",
    slides: [
      {
        src: "./Static/img/PotatoLizLogIn.jpg",
        alt: "PotatoLiz login page",
      },
      {
        src: "./Static/img/PotatolizDashBoard.png",
        alt: "PotatoLiz dashboard",
      },
      {
        src: "./Static/img/PotatolizRecieptPreview.png",
        alt: "PotatoLiz receipt preview",
      },
    ],
  },
  dentaliz: {
    title: "DentaLiz",
    slides: [
      {
        src: "./Static/img/DentaLizDashBoard.jpg",
        alt: "DentaLiz dashboard",
      },
      {
        src: "./Static/img/DentaLiz Graph.jpg",
        alt: "DentaLiz analytics graph",
      },
      {
        src: "./Static/img/DentaLizProfit.jpg",
        alt: "DentaLiz profit report",
      },
    ],
  },
  reeliz: {
    title: "ReeLiz",
    slides: [
      {
        src: "./Static/img/ReelizHome.png",
        alt: "ReeLiz home page",
      },
      {
        src: "./Static/img/ReelizSignUp.png",
        alt: "ReeLiz sign up page",
      },
      {
        src: "./Static/img/ReeLiz1.png",
        alt: "ReeLiz movie listing",
      },
      {
        src: "./Static/img/ReeLizBooking.png",
        alt: "ReeLiz booking flow",
      },
    ],
  },
  nutriliz: {
    title: "NutriLiz",
    slides: [
      {
        src: "./Static/img/NutriLizHome.jpg",
        alt: "NutriLiz home screen",
      },
      {
        src: "./Static/img/NutriLizImage.jpg",
        alt: "NutriLiz food image logger",
      },
      {
        src: "./Static/img/NutriLizBarcode.jpg",
        alt: "NutriLiz barcode scanner",
      },
      {
        src: "./Static/img/NutriLizHistory.jpg",
        alt: "NutriLiz history screen",
      },
    ],
  },
};

const stackCards = document.querySelectorAll(".project-stack-card");
const previewDots = document.querySelectorAll(".preview-dot");
const previewPrev = document.querySelector(".preview-arrow-prev");
const previewNext = document.querySelector(".preview-arrow-next");
const projectStackGrid = document.querySelector(".project-stack-grid");
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("projectModalTitle");
const carouselImage = document.getElementById("carouselImage");
const carouselFrame = document.querySelector(".carousel-frame");
const swipeHint = document.querySelector(".swipe-hint");
const modalDots = document.querySelectorAll(".modal-dot");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const modalClose = document.querySelector(".modal-close");
const modalBackdrop = document.querySelector("[data-close-modal]");
const dentalizModalDetails = document.getElementById("dentalizModalDetails");
const nutrilizModalDetails = document.getElementById("nutrilizModalDetails");
const reelizModalDetails = document.getElementById("reelizModalDetails");
const potatolizModalDetails = document.getElementById("potatolizModalDetails");

let activeProjectKey = "";
let activeSlideIndex = 0;
let previewCenterIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let previewTouchStartX = 0;
let previewTouchStartY = 0;
let swipeHintTimer;
const dentalizPreviewImage = document.getElementById("dentalizPreviewImage");
const dentalizPreviewCaption = document.getElementById("dentalizPreviewCaption");
const dentalizSlideCount = document.getElementById("dentalizSlideCount");
const dentalizDots = document.querySelectorAll(".dentaliz-dot");
const dentalizPreviewPrev = document.querySelector(".dentaliz-slide-prev");
const dentalizPreviewNext = document.querySelector(".dentaliz-slide-next");

function updateDentalizPreview() {
  const slides = projectData.dentaliz.slides;
  const slide = slides[activeSlideIndex % slides.length];

  if (!dentalizPreviewImage || !dentalizPreviewCaption) return;

  dentalizPreviewImage.src = slide.src;
  dentalizPreviewImage.alt = slide.alt;
  dentalizPreviewCaption.textContent = slide.description;
  if (dentalizSlideCount) {
    dentalizSlideCount.textContent = `${String(activeSlideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }
  dentalizDots.forEach((dot, index) => {
    const isActive = index === activeSlideIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function moveDentalizPreview(step) {
  activeSlideIndex = (activeSlideIndex + step + projectData.dentaliz.slides.length) % projectData.dentaliz.slides.length;
  updateDentalizPreview();
}

dentalizPreviewPrev?.addEventListener("click", () => moveDentalizPreview(-1));
dentalizPreviewNext?.addEventListener("click", () => moveDentalizPreview(1));
dentalizDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    activeSlideIndex = Number(dot.dataset.index);
    updateDentalizPreview();
  });
});
updateDentalizPreview();

function updateModalDots() {
  const project = projectData[activeProjectKey];

  if (!project || !modalDots.length) return;

  modalDots.forEach((dot, index) => {
    const isAvailable = index < project.slides.length;
    const isActive = index === activeSlideIndex;
    dot.hidden = !isAvailable;
    dot.disabled = !isAvailable;
    dot.setAttribute("aria-hidden", String(!isAvailable));
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
}
function normalizePreviewIndex(index, total) {
  return (index + total) % total;
}

function renderProjectPreview() {
  if (!stackCards.length) {
    return;
  }

  const total = stackCards.length;
  const centerIndex = normalizePreviewIndex(previewCenterIndex, total);
  const leftIndex = normalizePreviewIndex(previewCenterIndex - 1, total);
  const rightIndex = normalizePreviewIndex(previewCenterIndex + 1, total);

  stackCards.forEach((card, index) => {
    card.classList.remove("is-left", "is-center", "is-right", "is-hidden");
    card.setAttribute("aria-hidden", "true");
    card.tabIndex = -1;

    if (index === centerIndex) {
      card.classList.add("is-center");
      card.setAttribute("aria-hidden", "false");
      card.tabIndex = 0;
      return;
    }

    if (index === leftIndex) {
      card.classList.add("is-left");
      card.setAttribute("aria-hidden", "false");
      card.tabIndex = 0;
      return;
    }

    if (index === rightIndex) {
      card.classList.add("is-right");
      card.setAttribute("aria-hidden", "false");
      card.tabIndex = 0;
      return;
    }

    card.classList.add("is-hidden");
  });

  previewDots.forEach((dot, index) => {
    const isActive = index === centerIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

if (previewDots.length) {
  previewDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const nextIndex = Number(dot.dataset.index);
      previewCenterIndex = nextIndex;
      renderProjectPreview();
    });
  });
}
function movePreview(step) {
  const total = stackCards.length;

  if (!total) {
    return;
  }

  previewCenterIndex = normalizePreviewIndex(previewCenterIndex + step, total);
  renderProjectPreview();
}

if (projectStackGrid) {
  projectStackGrid.addEventListener(
    "touchstart",
    (event) => {
      const [touch] = event.touches;
      previewTouchStartX = touch.clientX;
      previewTouchStartY = touch.clientY;
    },
    { passive: true }
  );

  projectStackGrid.addEventListener(
    "touchend",
    (event) => {
      const [touch] = event.changedTouches;
      const distanceX = touch.clientX - previewTouchStartX;
      const distanceY = touch.clientY - previewTouchStartY;

      if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY)) {
        return;
      }

      movePreview(distanceX < 0 ? 1 : -1);
      document.querySelector(".project-carousel-guide")?.classList.add("is-dismissed");
    },
    { passive: true }
  );
}

function updateCarousel(direction = 1) {
  const project = projectData[activeProjectKey];

  if (!project) {
    return;
  }

  const slide = project.slides[activeSlideIndex];
  modalTitle.textContent = project.title;
  carouselImage.src = slide.src;
  carouselImage.alt = slide.alt;
  carouselImage.classList.remove("is-changing");
  carouselImage.style.setProperty("--slide-direction", `${direction < 0 ? "-" : ""}22px`);
  void carouselImage.offsetWidth;
  carouselImage.classList.add("is-changing");

  if (dentalizModalDetails) {
    const isDentaliz = activeProjectKey === "dentaliz";
    dentalizModalDetails.hidden = !isDentaliz;
  }
  if (nutrilizModalDetails) {
    nutrilizModalDetails.hidden = activeProjectKey !== "nutriliz";
  }
  if (reelizModalDetails) {
    reelizModalDetails.hidden = activeProjectKey !== "reeliz";
  }
  if (potatolizModalDetails) {
    potatolizModalDetails.hidden = activeProjectKey !== "potatoliz";
  }

  updateModalDots();
}

function scheduleSwipeHint() {
  if (!swipeHint) return;

  window.clearTimeout(swipeHintTimer);
  swipeHint.classList.add("is-dismissed");
  swipeHintTimer = window.setTimeout(() => {
    if (projectModal?.classList.contains("open")) {
      swipeHint.classList.remove("is-dismissed");
      swipeHint.classList.remove("is-reminding");
      void swipeHint.offsetWidth;
      swipeHint.classList.add("is-reminding");
    }
  }, 1000);
}

modalDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.index);
    activeSlideIndex = index;
    updateCarousel();
  });
});

function openProjectModal(projectKey) {
  if (!projectData[projectKey] || !projectModal) {
    return;
  }

  activeProjectKey = projectKey;
  activeSlideIndex = 0;
  updateCarousel();
  swipeHint?.classList.remove("is-dismissed");

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  if (!projectModal) {
    return;
  }

  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.clearTimeout(swipeHintTimer);
}

function showNextSlide(step) {
  const project = projectData[activeProjectKey];

  if (!project) {
    return;
  }

  const totalSlides = project.slides.length;
  activeSlideIndex = (activeSlideIndex + step + totalSlides) % totalSlides;
  updateCarousel(step);
}

if (carouselFrame) {
  carouselFrame.addEventListener(
    "touchstart",
    (event) => {
      const [touch] = event.touches;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  carouselFrame.addEventListener(
    "touchend",
    (event) => {
      const [touch] = event.changedTouches;
      const distanceX = touch.clientX - touchStartX;
      const distanceY = touch.clientY - touchStartY;

      if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY)) {
        return;
      }

      showNextSlide(distanceX < 0 ? 1 : -1);
      scheduleSwipeHint();
    },
    { passive: true }
  );
}

stackCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    const total = stackCards.length;
    const centerIndex = normalizePreviewIndex(previewCenterIndex, total);

    if (index !== centerIndex) {
      previewCenterIndex = index;
      renderProjectPreview();
      return;
    }

    openProjectModal(card.dataset.project);
  });
});

renderProjectPreview();

previewPrev?.addEventListener("click", () => movePreview(-1));
previewNext?.addEventListener("click", () => movePreview(1));

if (carouselPrev) {
  carouselPrev.addEventListener("click", () => {
    showNextSlide(-1);
    scheduleSwipeHint();
  });
}

if (carouselNext) {
  carouselNext.addEventListener("click", () => {
    showNextSlide(1);
    scheduleSwipeHint();
  });
}

if (modalDots.length) {
  modalDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const chosenIndex = Number(dot.dataset.index);
      activeSlideIndex = chosenIndex;
      updateCarousel();
      scheduleSwipeHint();
    });
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeProjectModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeProjectModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMobileMenu(false);
  }

  if (!projectModal || !projectModal.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeProjectModal();
  }

  if (event.key === "ArrowLeft") {
    showNextSlide(-1);
  }

  if (event.key === "ArrowRight") {
    showNextSlide(1);
  }
});

const revealElements = document.querySelectorAll(
  ".flat-section, .hero-content"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle(
        "is-visible",
        entry.isIntersecting
      );
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});