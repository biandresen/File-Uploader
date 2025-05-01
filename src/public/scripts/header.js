const navEl = document.querySelector("nav");
const menuBtn = document.querySelector("#menu-btn");

menuBtn.addEventListener("click", toggleMenu);

const closeMenu = () => (navEl.style.height = "0px");
const openMenu = () => (navEl.style.height = navEl.scrollHeight + "px");

// Toggle menu open/close
function toggleMenu() {
  navEl.classList.toggle("open");
  if (navEl.classList.contains("open")) openMenu();
  else closeMenu();
}

// Close menu when clicking outside or on a nav link
document.addEventListener("click", (e) => {
  const isClickInsideMenu = navEl.contains(e.target);
  const isMenuBtnClick = menuBtn.contains(e.target);
  const isLink = e.target.matches('a[data-link="page"]');
  const isThemeBtn = e.target.matches('img[data-btn="theme"]');

  if (!navEl.classList.contains("open")) return;

  if ((!isMenuBtnClick && !isClickInsideMenu) || isLink || isThemeBtn) {
    toggleMenu();
  }
});
