const triggers = document.querySelectorAll(".trigger");

triggers.forEach(trigger => {
  trigger.addEventListener("click", () => {
    const item = trigger.parentElement;
    const panel = item.querySelector(".panel");
    const isOpen = panel.classList.contains("open");

    document.querySelectorAll(".panel").forEach(p => {
      p.classList.remove("open");
    });

    if (!isOpen) {
      panel.classList.add("open");
    }
  });
});