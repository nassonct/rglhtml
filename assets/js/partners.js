(function () {
  "use strict";

  var marquee = document.querySelector("[data-partner-marquee]");
  if (!marquee) {
    return;
  }

  var status = marquee.querySelector("[data-partner-status]");
  var scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) {
    throw new Error("The partner script URL is unavailable.");
  }

  fetch(new URL("../partners/partners.json", scriptUrl))
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Partner manifest request failed: " + response.status);
      }
      return response.json();
    })
    .then(function (partners) {
      if (!Array.isArray(partners)) {
        throw new Error("Partner manifest must contain an array.");
      }

      var validPartners = partners.filter(function (partner) {
        return partner
          && typeof partner.name === "string"
          && partner.name.trim()
          && typeof partner.logo === "string"
          && /^[a-z0-9][a-z0-9._ -]*\.(?:png|jpe?g|svg|webp)$/i.test(partner.logo);
      });

      if (!validPartners.length) {
        return;
      }

      var track = document.createElement("div");
      track.className = "partner-track";
      validPartners.concat(validPartners).forEach(function (partner, index) {
        var item = document.createElement("div");
        item.className = "partner-item";
        if (index >= validPartners.length) {
          item.setAttribute("aria-hidden", "true");
        }

        var image = document.createElement("img");
        image.src = new URL("../partners/" + encodeURIComponent(partner.logo), scriptUrl).href;
        image.alt = index < validPartners.length ? partner.name : "";
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", function () {
          item.remove();
          if (!track.querySelector(".partner-item:not([aria-hidden])")) {
            track.remove();
            if (status) {
              status.hidden = false;
              status.textContent = "Partner logos could not be loaded. Please check the partner manifest.";
            }
          }
        });

        item.appendChild(image);
        track.appendChild(item);
      });

      if (status) {
        status.hidden = true;
      }
      marquee.appendChild(track);
    })
    .catch(function (error) {
      console.error(error);
      if (status) {
        status.textContent = "Partner logos could not be loaded. Please check the partner manifest.";
      }
    });
})();
