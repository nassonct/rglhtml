/* Progressive enhancement only — every page works with JavaScript disabled. */
(function () {
  "use strict";

  // Mobile navigation ------------------------------------------------------
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.getElementById("mobile-nav");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Home hero slideshow ---------------------------------------------------
  var slideshows = document.querySelectorAll("[data-hero-slideshow]");
  Array.prototype.forEach.call(slideshows, function (slideshow) {
    var slides = slideshow.querySelectorAll(".hero__slide");
    var interval = parseInt(slideshow.getAttribute("data-interval") || "3000", 10);

    if (slides.length < 2) {
      return;
    }

    window.setInterval(function () {
      var current = slideshow.querySelector(".hero__slide.is-active");
      var currentIndex = Array.prototype.indexOf.call(slides, current);
      var next = slides[(currentIndex + 1) % slides.length];

      current.classList.remove("is-active");
      current.setAttribute("aria-hidden", "true");
      next.classList.add("is-active");
      next.removeAttribute("aria-hidden");
    }, interval);
  });

  // Client-side convenience checks on the enquiry form ---------------------
  var forms = document.querySelectorAll("[data-enquiry-form]");
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = form.querySelector('[name="email"]');
      var phone = form.querySelector('[name="phone"]');
      var file = form.querySelector('[name="attachment"]');
      var maxBytes = parseInt(form.getAttribute("data-max-bytes") || "0", 10);
      var error = form.querySelector("[data-form-error]");
      var isSwahili = document.documentElement.lang === "sw";

      function fail(message) {
        if (error) {
          error.textContent = message;
          error.hidden = false;
          error.scrollIntoView({ block: "center" });
        }
      }

      var invalid = form.querySelector(":invalid");
      if (invalid) {
        invalid.reportValidity();
        return;
      }

      if (email && phone && !email.value.trim() && !phone.value.trim()) {
        return fail(form.getAttribute("data-msg-contact") || "Provide an email address or a phone number.");
      }

      if (file && file.files && file.files.length && maxBytes && file.files[0].size > maxBytes) {
        return fail(form.getAttribute("data-msg-size") || "The attachment is too large.");
      }

      var action = form.getAttribute("action") || "";
      if (action.indexOf("mailto:") !== 0) {
        return fail(isSwahili
          ? "Rasimu ya barua pepe haikuweza kutayarishwa. Tafadhali tutumie barua pepe moja kwa moja."
          : "The email draft could not be prepared. Please email us directly.");
      }

      var subjectType = form.querySelector('[name="enquiry_type"]');
      var subject = subjectType ? subjectType.options[subjectType.selectedIndex].text : "Farmer / supplier";
      var lines = [(isSwahili ? "Ombi la tovuti: " : "Website enquiry: ") + subject, ""];

      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name || field.type === "hidden" || field.type === "file" || field.type === "submit") {
          return;
        }

        var value = field.value.trim();
        if (!value) {
          return;
        }

        var label = field.id ? form.querySelector('label[for="' + field.id + '"]') : null;
        var labelText = label ? label.textContent.replace(/\s+/g, " ").trim().replace(/\s*\*$/, "") : field.name;
        if (field.tagName === "SELECT") {
          value = field.options[field.selectedIndex].text;
        }
        lines.push(labelText + ": " + value);
      });

      if (file && file.files && file.files.length) {
        lines.push("");
        lines.push(isSwahili
          ? "Kiambatisho kimechaguliwa: " + file.files[0].name + " (tafadhali kiambatishe kwenye barua pepe hii)."
          : "Attachment selected: " + file.files[0].name + " (please attach it to this email).");
      }

      var subjectPrefix = isSwahili ? "Ombi la tovuti" : "Website enquiry";
      var mailto = action + "?subject=" + encodeURIComponent(subjectPrefix + " - " + subject)
        + "&body=" + encodeURIComponent(lines.join("\n"));
      if (mailto.length > 8000) {
        return fail(isSwahili
          ? "Ombi hili ni refu sana kufunguliwa kama rasimu ya barua pepe. Tafadhali punguza ujumbe au tutumie barua pepe moja kwa moja."
          : "This enquiry is too long to open in an email draft. Please shorten your message or email us directly.");
      }

      window.location.href = mailto;
    });
  });

  // Section reveal ---------------------------------------------------------
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  Array.prototype.forEach.call(revealables, function (el) {
    observer.observe(el);
  });
})();
