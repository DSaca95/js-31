document.querySelectorAll(".accordion-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));

        document.querySelectorAll(".accordion-trigger").forEach(btn => {
            btn.setAttribute("aria-expanded", "false");
        });
        document.querySelectorAll(".accordion-panel").forEach(p => {
            p.setAttribute("aria-hidden", "true");
            p.hidden = true;
        });

        if (!expanded) {
            trigger.setAttribute("aria-expanded", "true");
            panel.setAttribute("aria-hidden", "false");
            panel.hidden = false;
        }
    });
});