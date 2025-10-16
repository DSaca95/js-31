const items = document.querySelectorAll(".item");

items.forEach(item => {
  const trigger = item.querySelector(".trigger");
  const panel = item.querySelector(".panel");

  trigger.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    items.forEach(i => {
      i.classList.remove("active");
      i.querySelector(".panel").style.display = "none";
    });

    if (!isActive) {
      item.classList.add("active");
      panel.style.display = "block";
    }
  });
});