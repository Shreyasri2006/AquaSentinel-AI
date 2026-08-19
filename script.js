/* AquaSentinel AI — shared website behaviour */

(() => {
    "use strict";

    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1120) {
                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            }
        });
    }

    function updatePageTime() {
        const currentYear = document.getElementById("currentYear");
        const lastUpdated = document.getElementById("lastUpdated");
        const now = new Date();

        if (currentYear) {
            currentYear.textContent = now.getFullYear();
        }

        if (lastUpdated) {
            lastUpdated.textContent = now.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    }

    updatePageTime();
    window.setInterval(updatePageTime, 60000);
})();