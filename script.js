/* DubMetric landing V1 — minimal vanilla JS.
 * The pilot form has no backend by design (static Vercel site):
 * submitting opens a pre-filled email in the visitor's own mail client.
 * We never simulate a successful server submission. */

(function () {
  "use strict";

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
    // Lightweight format check only; the browser's email input type
    // already provides basic validation for supported clients.
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
    statusBox.textContent =
      "Opening your email client to send the request…";
    statusBox.removeAttribute("data-error");
  });
})();
