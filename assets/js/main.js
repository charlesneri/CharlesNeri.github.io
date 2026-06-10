/**
 * Template Name: Folio
 * Template URL: https://bootstrapmade.com/folio-bootstrap-portfolio-template/
 * Updated: Aug 08 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Toggle portfolio descriptions
   */
  document.querySelectorAll(".portfolio-description-toggle").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const info = this.closest(".portfolio-info");
      if (!info) return;

      info.classList.toggle("details-open");
      this.textContent = info.classList.contains("details-open")
        ? "Hide description"
        : "View description";
    });
  });

  /**
   * Export the rendered webpage content as a section-by-section PDF download.
   */
  function cleanPdfClone(element) {
    element
      .querySelectorAll(
        "script, button, iframe, .portfolio-filters, .preview-link, .scroll-top, #preloader, #theme-toggle"
      )
      .forEach((item) => item.remove());

    element.querySelectorAll("[data-aos], [data-aos-delay]").forEach((item) => {
      item.removeAttribute("data-aos");
      item.removeAttribute("data-aos-delay");
    });

    element.querySelectorAll(".portfolio-info").forEach((item) => {
      item.classList.add("details-open");
    });

    element.querySelectorAll(".isotope-item").forEach((item) => {
      item.removeAttribute("style");
    });

    return element;
  }

  function createPdfPage(title, sourceElement, filterClass) {
    const page = document.createElement("section");
    page.className = "pdf-export-page";

    const heading = document.createElement("h2");
    heading.textContent = title;
    page.appendChild(heading);

    const clone = cleanPdfClone(sourceElement.cloneNode(true));

    if (filterClass) {
      clone.querySelectorAll(".portfolio-item").forEach((item) => {
        if (!item.classList.contains(filterClass)) {
          item.remove();
        }
      });
    }

    page.appendChild(clone);
    return page;
  }

  function buildPdfDocument() {
    const wrapper = document.createElement("div");
    wrapper.className = "pdf-export-document";

    [
      ["Home", "#hero"],
      ["About", "#about"],
      ["Experience", "#experience"],
      ["Skills", "#services"],
      ["Certificates", "#portfolio", "filter-app"],
      ["Projects", "#portfolio", "filter-product"],
      ["Contact", "#contact"],
    ].forEach(([title, selector, filterClass]) => {
      const sourceElement = document.querySelector(selector);
      if (sourceElement) {
        wrapper.appendChild(createPdfPage(title, sourceElement, filterClass));
      }
    });

    document.body.appendChild(wrapper);
    return wrapper;
  }

  function waitForPdfImages(element) {
    const images = Array.from(element.querySelectorAll("img"));

    return Promise.all(
      images.map((image) => {
        if (image.complete && image.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      })
    );
  }

  function getPdfOptions() {
    return {
      margin: [10, 10, 10, 10],
      filename: "Charles-Neri-Portfolio.pdf",
      image: { type: "jpeg", quality: 0.96 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#07080d",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
  }

  function showPdfPreview(pdfBlob) {
    const oldPreview = document.querySelector(".pdf-preview-modal");
    if (oldPreview) {
      oldPreview.remove();
    }

    const pdfUrl = URL.createObjectURL(pdfBlob);
    const preview = document.createElement("div");
    preview.className = "pdf-preview-modal active";
    preview.innerHTML = `
      <div class="pdf-preview-dialog" role="dialog" aria-modal="true" aria-label="PDF preview">
        <div class="pdf-preview-header">
          <h3>PDF Preview</h3>
          <div class="pdf-preview-actions">
            <a href="${pdfUrl}" download="Charles-Neri-Portfolio.pdf">Download</a>
            <button type="button" class="pdf-preview-close">Close</button>
          </div>
        </div>
        <iframe class="pdf-preview-frame" src="${pdfUrl}" title="PDF preview"></iframe>
      </div>
    `;

    const closePreview = () => {
      preview.remove();
      URL.revokeObjectURL(pdfUrl);
    };

    preview
      .querySelector(".pdf-preview-close")
      .addEventListener("click", closePreview);

    preview.addEventListener("click", (event) => {
      if (event.target === preview) {
        closePreview();
      }
    });

    document.body.appendChild(preview);
  }

  const exportPdfButton = document.querySelector("#export-pdf");
  if (exportPdfButton) {
    exportPdfButton.addEventListener("click", async () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }

      if (typeof html2pdf === "undefined") {
        alert("PDF export is still loading. Please check your internet connection and try again.");
        return;
      }

      const originalButtonText = exportPdfButton.innerHTML;
      exportPdfButton.disabled = true;
      exportPdfButton.innerHTML =
        '<i class="bi bi-hourglass-split"></i><span>Exporting</span>';

      const pdfDocument = buildPdfDocument();

      try {
        await waitForPdfImages(pdfDocument);

        const pdfBlob = await html2pdf()
          .set(getPdfOptions())
          .from(pdfDocument)
          .outputPdf("blob");

        showPdfPreview(pdfBlob);
      } finally {
        pdfDocument.remove();
        exportPdfButton.disabled = false;
        exportPdfButton.innerHTML = originalButtonText;
      }
    });
  }

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            if (typeof aosInit === "function") {
              aosInit();
            }
          },
          false
        );
      });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  /*
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });
*/
  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();
/* dark and light mode theme*/
const toggle = document.getElementById("togglelight");
const body = document.body;

function syncThemeIcon() {
  if (!toggle) return;

  if (body.classList.contains("light-mode")) {
    toggle.classList.remove("bi-moon-fill");
    toggle.classList.add("bi-brightness-high-fill");
  } else {
    toggle.classList.remove("bi-brightness-high-fill");
    toggle.classList.add("bi-moon-fill");
  }
}

// Check localStorage for saved theme preference
if (localStorage.getItem("theme") === "light-mode") {
  body.classList.add("light-mode");
}

syncThemeIcon();

if (toggle) {
  toggle.addEventListener("click", function () {
    body.classList.toggle("light-mode");
    localStorage.setItem(
      "theme",
      body.classList.contains("light-mode") ? "light-mode" : "dark-mode"
    );
    syncThemeIcon();
  });
}
