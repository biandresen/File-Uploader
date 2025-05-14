// user.js
import { PATH } from "./constants.js";
import nav from "./nav.js";
import { $create, $ } from "./utils.js";

const dashboardSection = $("#dashboard-section");

export function insertUserName() {
  const userName = user.userInfo.email.split("@")[0];
  const userNameElement = $create("p", { text: "USER: " + userName, id: "user-name" });
  dashboardSection.prepend(userNameElement);
}

export const user = {
  isAuthenticated: false,
  userInfo: null,
  data: null,
  allFolders: null,

  async checkAuth() {
    try {
      const res = await fetch(PATH.BASEURL + PATH.CHECKAUTH, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      this.isAuthenticated = data.loggedIn;
      this.userInfo = data.user || null;
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
      const res = await fetch(PATH.BASEURL + PATH.USERCONTENT, {
        method: "GET",
      });
      if (!res.ok) throw new Error(`Failed getting user content: ${res.status}`);
      const data = await res?.json();
      this.data = data.data;
      return data.data;
    } catch (err) {
      console.error("Error getting user content: ", err);
    }
  },

  async getAllFolders() {
    try {
      const res = await fetch(PATH.BASEURL + PATH.ALLFOLDERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res?.json();
      if (!res.ok) throw new Error(`Failed getting folders: ${res.status}`);
      this.allFolders = data.folders;
      return data.folders;
    } catch (err) {
      console.error("Error getting user content: ", err);
    }
  },
};
