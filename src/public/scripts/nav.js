import { navigate } from "./router.js";
import { $ } from "./utils.js";

const navItems = {
  loggedOut: `
<button class="icon-btn">
    <li>
      <img data-btn="theme" src="/assets/icons/theme.svg" alt="" />
    </li>
  </button>
  <li><a data-link="page" href="/register">Register</a></li>
  <li><a data-link="page" href="/login">Login</a></li>
  <li><a data-link="page" href="/about">About</a></li>`,
  loggedIn: `
<button class="icon-btn">
    <li>
      <img data-btn="theme" src="/assets/icons/theme.svg" alt="" />
    </li>
  </button>
  <li><a data-link="page" href="/">Home</a></li>
  <li><a data-link="page" href="/logout">Logout</a></li>
  <li><a data-link="page" href="/about">About</a></li>`,
};

const nav = {
  init(userIsAuthenticated) {
    console.log("Init nav object...");
    this.userIsAuthenticated = userIsAuthenticated;
    this.navList = $("#header__nav-list");
    this.navEl = $("nav");
    this.menuBtn = $("#menu-btn");
    this.topHomeLink = $("#top-home-link");

    this.menuBtn.addEventListener("click", () => this.toggleMenu());
    this.initLinkEvents();
    this.initOutsideClickHandler();
    this.render();
    return this;
  },
  initLinkEvents() {
    console.log("Init link events...");
    //Event delegation
    ["header", "#login-section", "#register-section"].forEach((selector) => {
      const container = $(selector);
      if (!container) return;

      container.addEventListener("click", (e) => {
        const link = e.target.closest('a[data-link="page"]');
        if (link) {
          e.preventDefault();
          navigate(link.getAttribute("href"));
          return;
        }
      });
    });
  },
  initOutsideClickHandler() {
    console.log("Init outside click handler...");
    document.addEventListener("click", (e) => {
      const isInside = this.navEl.contains(e.target);
      const isMenuBtn = this.menuBtn.contains(e.target);
      const isLink = e.target.matches('a[data-link="page"]');
      const isThemeBtn = e.target.matches('img[data-btn="theme"]');
      if (!this.navEl.classList.contains("open")) return;
      if ((!isMenuBtn && !isInside) || isLink || isThemeBtn) {
        this.toggleMenu();
      }
    });
  },
  toggleMenu() {
    console.log("Toggle menu...");
    this.navEl.classList.toggle("open");
    this.navEl.style.height = this.navEl.classList.contains("open") ? this.navEl.scrollHeight + "px" : "0px";
  },
  render() {
    console.log("Rendering navlist...");
    if (this.userIsAuthenticated) {
      this.navList.innerHTML = navItems.loggedIn;
      this.topHomeLink.setAttribute("href", "/");
    } else {
      this.navList.innerHTML = navItems.loggedOut;
      this.topHomeLink.setAttribute("href", "/login");
    }

    return this;
  },
  updateAuthState(isAuthenticated) {
    console.log("Updating auth state...");
    this.userIsAuthenticated = isAuthenticated;
    this.render();
    return this;
  },
  logoutHandler() {
    console.log("Logout handler...");
    this.updateAuthState(false);
    this.render();
    return this;
  },
};

export default nav;

// Close menu when clicking outside or on a nav link
// document.addEventListener("click", (e) => {
//   const isClickInsideMenu = navEl.contains(e.target);
//   const isMenuBtnClick = menuBtn.contains(e.target);
//   const isLink = e.target.matches('a[data-link="page"]');
//   const isThemeBtn = e.target.matches('img[data-btn="theme"]');

//   if (!navEl.classList.contains("open")) return;

//   if ((!isMenuBtnClick && !isClickInsideMenu) || isLink || isThemeBtn) {
//     toggleMenu();
//   }
// });
