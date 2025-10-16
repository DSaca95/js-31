const triggers = document.querySelectorAll(".trigger");

triggers.forEach(trigger => {
  trigger.addEventListener("click", () => {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    const icon = trigger.querySelector(".icon");
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";

    triggers.forEach(btn => {
      btn.setAttribute("aria-expanded", "false");
      btn.querySelector(".icon").textContent = "+";
    });
    document.querySelectorAll(".panel").forEach(p => {
      p.setAttribute("aria-hidden", "true");
      p.hidden = true;
    });

    if (!isExpanded) {
      trigger.setAttribute("aria-expanded", "true");
      icon.textContent = "−";
      panel.setAttribute("aria-hidden", "false");
      panel.hidden = false;
    }
  });
});