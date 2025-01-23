const items = document.querySelectorAll(".item");
const overlays = document.querySelectorAll(".overlay");
const menus = document.querySelectorAll(".menu");

const expand = (item, i) => {
  let overlay = item.childNodes[1];
  let menu = item.childNodes[3];

  items.forEach((it, ind) => {
    if (i === ind) return;
    it.clicked = false;
  });

  gsap.killTweensOf(items);
  gsap.to(items, {
    width: item.clicked ? "10vw" : "8vw",
    duration: 2,
    ease: "elastic(1, .6)",
  });

  gsap.killTweensOf(item);
  item.clicked = !item.clicked;
  gsap.to(item, {
    width: item.clicked ? "25vw" : "10vw",
    duration: 2.5,
    ease: "elastic(1, .3)",
  });

  gsap.killTweensOf(overlays);
  gsap.to(overlays, {
    opacity: item.clicked ? "1" : "1",
    duration: 2,
    ease: "elastic(1, .6)",
  });

  gsap.killTweensOf(overlay);
  item.clicked = !item.clicked;
  gsap.to(overlay, {
    opacity: item.clicked ? "1" : "0",
    duration: 2.5,
    ease: "elastic(1, .3)",
  });

  gsap.killTweensOf(menus);
  gsap.to(menus, {
    opacity: item.clicked ? "0" : "0",
    duration: 2,
    ease: "elastic(1, .6)",
  });

  gsap.killTweensOf(menu);
  item.clicked = !item.clicked;
  gsap.to(menu, {
    opacity: item.clicked ? "1" : "0",
    duration: 2.5,
    ease: "elastic(1, .3)",
  });
};

items.forEach((item, i) => {
  item.clicked = false;
  item.childNodes[1].clicked = false;
  item.childNodes[3].clicked = false;

  item.addEventListener("click", () => expand(item, i));
});

const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".read-more").forEach((button) => {
  button.addEventListener("click", () => {
    modal.style.display = "block";
    const item = button.closest(".item");
    const title = item.querySelector("label").textContent;
    const description = "Description for " + title;
    const image = item.querySelector("div").style.backgroundImage.split('"')[1];
    modal.querySelector(".modal-title").textContent = title;
    modal.querySelector(".modal-description").textContent = description;
    modal.querySelector(".modal-image").src = image;
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
