/* DubMetric landing — lightweight interactions only. No analytics, no network calls. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Motion-style QC tabs */
  var tabList = document.querySelector(".motion-tabs");
  var tabs = tabList ? Array.prototype.slice.call(tabList.querySelectorAll(".motion-tab")) : [];
  var panels = Array.prototype.slice.call(document.querySelectorAll(".preview-panel"));

  function positionPill(activeTab) {
    if (!tabList || !activeTab) return;
    var listRect = tabList.getBoundingClientRect();
    var tabRect = activeTab.getBoundingClientRect();
    var inset = 4.48;
    tabList.style.setProperty("--pill-x", (tabRect.left - listRect.left - inset) + "px");
    tabList.style.setProperty("--pill-w", tabRect.width + "px");
  }

  function activateTab(tab) {
    var target = tab.getAttribute("data-tab");

    tabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.setAttribute("tabindex", active ? "0" : "-1");
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== target;
    });

    positionPill(tab);
  }

  if (tabs.length) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activateTab(tab); });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var direction = event.key === "ArrowRight" ? 1 : -1;
        var next = (index + direction + tabs.length) % tabs.length;
        tabs[next].focus();
        activateTab(tabs[next]);
      });
    });

    requestAnimationFrame(function () {
      positionPill(document.querySelector(".motion-tab.is-active"));
    });

    window.addEventListener("resize", function () {
      positionPill(document.querySelector(".motion-tab.is-active"));
    });
  }

  /* Calm scroll reveals; disabled when reduced motion is requested. */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    revealItems.forEach(function (item) { observer.observe(item); });
  }

  /* Pilot form: static by design. Submission opens the visitor's mail client. */
  var form = document.getElementById("pilot-form");
  if (!form) return;

  var statusBox = document.getElementById("form-status");
  var PILOT_EMAIL = "pilot@dubmetric.com";

  function showError(message) {
    statusBox.textContent = message;
    statusBox.setAttribute("data-error", "true");
  }

  function clearStatus() {
    statusBox.textContent = "";
    statusBox.removeAttribute("data-error");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    var name = form.elements["name"].value.trim();
    var email = form.elements["email"].value.trim();
    var company = form.elements["company"].value.trim();
    var roleSelect = form.elements["role"];
    var role = roleSelect.value;
    var message = form.elements["message"].value.trim();

    if (!name || !email || !company || !role) {
      showError("Please fill in your name, work email, company and role.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid work email address.");
      return;
    }

    var subject = "Private pilot request - " + company;
    var bodyLines = [
      "Name: " + name,
      "Work email: " + email,
      "Company: " + company,
      "Role: " + roleSelect.options[roleSelect.selectedIndex].text
    ];

    if (message) bodyLines.push("", "Message:", message);

    var mailto =
      "mailto:" + PILOT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(bodyLines.join("\n"));

    window.location.href = mailto;
    statusBox.textContent = "Opening your email client to send the request…";
    statusBox.removeAttribute("data-error");
  });
})();
