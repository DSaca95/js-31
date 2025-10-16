const triggers = document.querySelectorAll(".trigger");

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.parentElement;
    const panel = item.querySelector(".panel");

    const isOpen = panel.classList.contains("open");

    document.querySelectorAll(".panel").forEach((p) => {
      if (p !== panel) {
        p.style.height = "0px";
        p.classList.remove("open");
      }
    });

    if (isOpen) {
      panel.style.height = "0px";
      panel.classList.remove("open");
    } else {
      panel.classList.add("open");
      panel.style.height = panel.scrollHeight + "px";
    }
  });
});
