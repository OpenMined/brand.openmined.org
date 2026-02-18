/* OpenMined Brand Guidelines — script.js */

(function () {
  "use strict";

  /* ---- Toast ---- */
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = setTimeout(function () {
      toast.classList.remove("visible");
    }, 2000);
  }

  /* ---- Copy color hex on click ---- */
  document.querySelectorAll(".color-swatch").forEach(function (swatch) {
    function copy() {
      var hex = swatch.getAttribute("data-color");
      if (!hex) return;
      navigator.clipboard.writeText(hex).then(function () {
        showToast("Copied " + hex);
      });
    }
    swatch.addEventListener("click", copy);
    swatch.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copy();
      }
    });
  });

  /* ---- Nav scroll highlighting ---- */
  var navLinks = document.querySelectorAll(".nav-links a");
  var sections = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, el: section, link: link });
  });

  function updateActiveNav() {
    var scrollY = window.scrollY + 100;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= scrollY) {
        current = sections[i];
      }
    }
    navLinks.forEach(function (l) {
      l.classList.remove("active");
    });
    if (current) current.link.classList.add("active");
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
})();
