(function () {
  "use strict";

  var gallery = document.querySelector("[data-gallery-root]");
  if (!gallery) {
    return;
  }

  var language = document.documentElement.lang === "sw" ? "sw" : "en";
  var scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) {
    throw new Error("The gallery script URL is unavailable.");
  }

  var siteRoot = new URL("../../", scriptUrl);
  var controls = gallery.querySelector("[data-gallery-filters]");
  var grid = gallery.querySelector("[data-gallery-grid]");
  var status = gallery.querySelector("[data-gallery-status]");
  var moreButton = gallery.querySelector("[data-gallery-more]");
  var dialog = document.querySelector("[data-gallery-dialog]");
  var dialogImage = dialog.querySelector("[data-lightbox-image]");
  var dialogCaption = dialog.querySelector("[data-lightbox-caption]");
  var currentImages = [];
  var currentIndex = 0;
  var activeCategory = "all";
  var renderedImageCount = 8;
  var imagesPerPage = 8;

  function text(tag, className, value) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    element.textContent = value;
    return element;
  }

  function setImage(image) {
    dialogImage.src = new URL(image.src, siteRoot).href;
    dialogImage.alt = image[language === "sw" ? "altSw" : "alt"] || image.alt;
    dialogCaption.textContent = image[language === "sw" ? "captionSw" : "caption"] || image.caption || "";
  }

  function renderImages(images, category) {
    grid.replaceChildren();
    var visible = images.filter(function (image) {
      return category === "all" || image.category === category;
    });
    currentImages = visible;
    moreButton.hidden = true;

    if (!visible.length) {
      status.hidden = false;
      status.textContent = language === "sw"
        ? "Hakuna picha zilizochapishwa katika kundi hili bado."
        : "No verified photographs have been published in this category yet.";
      return;
    }

    status.hidden = true;
    visible.slice(0, renderedImageCount).forEach(function (image) {
      var figure = document.createElement("figure");
      figure.className = "gallery-card";
      var button = document.createElement("button");
      button.className = "gallery-image-button";
      button.type = "button";
      button.setAttribute("aria-label", language === "sw" ? "Fungua picha: " + image.altSw : "Open image: " + image.alt);

      var photo = document.createElement("img");
      photo.src = new URL(image.src, siteRoot).href;
      photo.alt = image[language === "sw" ? "altSw" : "alt"] || image.alt;
      photo.width = image.width;
      photo.height = image.height;
      photo.loading = "lazy";
      photo.decoding = "async";
      photo.addEventListener("error", function () {
        figure.remove();
        console.error("Gallery image could not be loaded: " + image.src);
        if (!grid.querySelector(".gallery-card")) {
          status.hidden = false;
          status.textContent = language === "sw"
            ? "Picha hazikuweza kupakiwa. Tafadhali angalia orodha ya picha."
            : "Gallery images could not be loaded. Please check the gallery manifest.";
        }
      });

      button.appendChild(photo);
      button.addEventListener("click", function () {
        currentIndex = currentImages.indexOf(image);
        setImage(currentImages[currentIndex]);
        dialog.showModal();
      });
      figure.appendChild(button);
      grid.appendChild(figure);
    });

    moreButton.hidden = visible.length <= renderedImageCount;
    moreButton.textContent = language === "sw" ? "→ Picha Nyingine" : "→ Other Pictures";
  }

  function setFilter(category) {
    activeCategory = category;
    renderedImageCount = imagesPerPage;
    controls.querySelectorAll("[data-gallery-filter]").forEach(function (button) {
      var selected = button.getAttribute("data-gallery-filter") === category;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    renderImages(gallery.images, category);
  }

  moreButton.addEventListener("click", function () {
    renderedImageCount += imagesPerPage;
    renderImages(gallery.images, activeCategory);
  });

  controls.addEventListener("click", function (event) {
    var button = event.target.closest("[data-gallery-filter]");
    if (button) {
      setFilter(button.getAttribute("data-gallery-filter"));
    }
  });

  dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () {
    dialog.close();
  });

  dialog.querySelector("[data-lightbox-previous]").addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    setImage(currentImages[currentIndex]);
  });

  dialog.querySelector("[data-lightbox-next]").addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % currentImages.length;
    setImage(currentImages[currentIndex]);
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("cancel", function (event) {
    event.preventDefault();
    dialog.close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && dialog.open) {
      event.preventDefault();
      dialog.close();
    }
  });

  fetch(new URL("../data/gallery.json", scriptUrl))
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Gallery manifest request failed: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data.categories)) {
        throw new Error("Gallery manifest has an invalid shape.");
      }

      gallery.images = data.categories.reduce(function (images, category) {
        if (!category || typeof category.id !== "string"
          || typeof category.directory !== "string"
          || !Array.isArray(category.photos)) {
          throw new Error("Gallery category has an invalid shape.");
        }

        var categoryName = category[language] || category.en;
        category.photos.forEach(function (photo, index) {
          var alt = categoryName + " - " + photo.replace(/\.[^.]+$/, "");
          images.push({
            src: category.directory + "/" + photo,
            category: category.id,
            alt: alt,
            altSw: alt,
            caption: categoryName + " - " + (index + 1),
            captionSw: categoryName + " - " + (index + 1)
          });
        });
        return images;
      }, []);

      controls.replaceChildren();
      var all = text("button", "btn btn--outline", language === "sw" ? "Picha zote" : "All photos");
      all.type = "button";
      all.setAttribute("data-gallery-filter", "all");
      all.setAttribute("aria-pressed", "true");
      controls.appendChild(all);

      data.categories.forEach(function (category) {
        var filter = text("button", "btn btn--outline", category[language]);
        filter.type = "button";
        filter.setAttribute("data-gallery-filter", category.id);
        filter.setAttribute("aria-pressed", "false");
        controls.appendChild(filter);
      });
      setFilter("all");
    })
    .catch(function (error) {
      console.error(error);
      status.hidden = false;
      status.textContent = language === "sw"
        ? "Matunzio hayakuweza kupakiwa. Tafadhali angalia faili ya maudhui."
        : "The gallery could not be loaded. Please check the gallery manifest.";
    });
})();
