// user.js
import { PATH } from "./constants.js";
import nav from "./nav.js";

export const user = {
  isAuthenticated: false,
  userInfo: null,
  data: null,

  async checkAuth() {
    try {
      const res = await fetch(PATH.BASEURL + PATH.CHECKAUTH, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      this.isAuthenticated = data.loggedIn;
      this.unserInfo = data.user || null;
      return this.isAuthenticated;
    } catch (err) {
      console.error("Auth check failed: ", err);
      this.isAuthenticated = false;
      return false;
    }
  },

  async logout() {
    try {
      await fetch(PATH.BASEURL + PATH.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      this.isAuthenticated = false;
      this.userInfo = null;
      nav.logoutHandler();
    } catch (err) {
      console.error("Logout failed", err);
    }
  },

  async getUserContent() {
    try {
      const res = await fetch(PATH.BASEURL + PATH.USERCONTENT);
      const data = await res?.json();
      this.data = data;
      return data;
    } catch (err) {
      console.error("Error getting user content: ", err);
    }
  },
};
