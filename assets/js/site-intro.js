(function () {
  "use strict";

  var intro = document.querySelector("[data-site-intro]");
  if (!intro) {
    return;
  }

  var navigation = performance.getEntriesByType("navigation")[0];
  var internalNavigation = document.referrer
    && new URL(document.referrer).origin === window.location.origin;

  if (internalNavigation && navigation && navigation.type !== "reload") {
    return;
  }

  intro.hidden = false;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dismissed = false;

  function dismiss() {
    if (dismissed) {
      return;
    }
    dismissed = true;
    if (reducedMotion) {
      intro.hidden = true;
      return;
    }
    intro.classList.add("is-leaving");
    window.setTimeout(function () {
      intro.hidden = true;
    }, 350);
  }

  if (reducedMotion) {
    dismiss();
  } else {
    window.addEventListener("load", function () {
      window.setTimeout(dismiss, 250);
    }, { once: true });
    window.setTimeout(dismiss, 1800);
  }
})();
