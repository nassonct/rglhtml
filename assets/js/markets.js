(function () {
  "use strict";

  var root = document.querySelector("[data-markets-root]");
  if (!root) {
    return;
  }

  var language = document.documentElement.lang === "sw" ? "sw" : "en";
  var baseUrl = new URL("../data/markets.json", document.currentScript.src);
  var regionList = root.querySelector("[data-market-regions]");
  var status = root.querySelector("[data-market-status]");
  var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-market-region]"));

  function appendText(parent, tagName, className, value) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = value;
    parent.appendChild(element);
    return element;
  }

  function renderBranch(branch, regionName) {
    var card = document.createElement("article");
    card.className = "card card--plain branch-card";
    appendText(card, "h4", "display-3", branch.name || (language === "sw" ? "Jina litathibitishwa" : "Name to be confirmed"));
    appendText(card, "p", "", regionName);
    appendText(card, "p", "", branch.address || (language === "sw" ? "Anwani haijathibitishwa." : "Address not yet confirmed."));
    appendText(card, "p", "", branch.description || (language === "sw" ? "Maelezo ya huduma hayajathibitishwa." : "Service details not yet confirmed."));

    if (branch.phone) {
      var telephone = document.createElement("a");
      telephone.href = "tel:" + branch.phone.replace(/[^\d+]/g, "");
      telephone.textContent = branch.phone;
      card.appendChild(telephone);
    } else {
      appendText(card, "p", "muted", language === "sw" ? "Namba ya simu haijathibitishwa." : "Telephone number not yet confirmed.");
    }

    if (branch.mapsUrl && /^https:\/\/(?:(?:www\.)?google\.com|maps\.google\.com)\/maps(?:\/|$)/i.test(branch.mapsUrl)) {
      var directions = document.createElement("a");
      directions.href = branch.mapsUrl;
      directions.rel = "noopener noreferrer";
      directions.target = "_blank";
      directions.textContent = language === "sw" ? "Maelekezo ya ramani" : "Directions";
      card.appendChild(directions);
    }

    return card;
  }

  function renderRegions(regions) {
    regionList.replaceChildren();
    regions.forEach(function (region) {
      var panel = document.createElement("article");
      panel.className = "market-region";
      panel.id = "region-" + region.id;
      panel.setAttribute("data-market-panel", region.id);
      panel.hidden = region.id !== (regions[0] && regions[0].id);

      var heading = appendText(panel, "h3", "display-3", region.name);
      heading.id = "region-heading-" + region.id;
      appendText(panel, "p", "muted", region.status);

      var branches = Array.isArray(region.branches) ? region.branches : [];
      var branchGrid = document.createElement("div");
      branchGrid.className = "grid grid--2 branch-grid";

      if (branches.length) {
        branches.forEach(function (branch) {
          branchGrid.appendChild(renderBranch(branch, region.name));
        });
      } else {
        appendText(
          branchGrid,
          "p",
          "branch-empty",
          language === "sw"
            ? "Hakuna taarifa za tawi zilizothibitishwa. Jina, anwani, simu na huduma zitachapishwa baada ya kampuni kuthibitisha."
            : "No branch details have been verified. Names, addresses, telephone numbers and services will be published after company confirmation."
        );
      }

      panel.appendChild(branchGrid);
      regionList.appendChild(panel);
    });

    buttons.forEach(function (button, index) {
      var selectedId = buttons[0] && buttons[0].getAttribute("data-market-region");
      button.setAttribute("aria-current", button.getAttribute("data-market-region") === selectedId ? "true" : "false");
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var id = button.getAttribute("data-market-region");
        root.querySelectorAll("[data-market-panel]").forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-market-panel") !== id;
        });
        buttons.forEach(function (other) {
          other.setAttribute("aria-current", other === button ? "true" : "false");
        });
        var activePanel = root.querySelector('[data-market-panel="' + id + '"]');
        if (activePanel) {
          activePanel.scrollIntoView({ block: "nearest" });
        }
      });

      button.setAttribute("aria-current", index === 0 ? "true" : "false");
    });

    if (status) {
      status.hidden = true;
    }
  }

  fetch(baseUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Market directory request failed: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data[language])) {
        throw new Error("Market directory does not contain the selected language.");
      }
      renderRegions(data[language]);
    })
    .catch(function (error) {
      console.error(error);
      if (status) {
        status.hidden = false;
        status.textContent = language === "sw"
          ? "Saraka ya matawi haikuweza kupakiwa. Taarifa za msingi zinaonyeshwa hapa chini."
          : "The branch directory could not be loaded. Basic region information is shown below.";
      }
    });
})();
