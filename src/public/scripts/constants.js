const isProd = window.location.hostname !== "localhost";

export const PATH = {
  BASEURL: isProd ? "https://file-uploader-6ipm.onrender.com" : "http://localhost:3000",
  HOME: "/",
  CHECKAUTH: "/check-auth",
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  USERCONTENT: "/user/get-content",
  FOLDER_NAMEPATCH: "/folders/",
  FILE_NAMEPATCH: "/files/",
  FOLDER_DELETE: "/folders/",
  FOLDER_CREATE: "/folders",
  FILE_DELETE: "/files/",
  FILE_CREATE: "/files",
  ALLFOLDERS: "/folders",
};

export const MSG = {
  REGISTER_HEADING: "REGISTRATION",
  REGISTER_SUCCESS: "Registration successful! 🎉",
  REGISTER_REDIRECT: "Trying to login...",
  LOGIN_HEADING: "LOGIN",
  LOGIN_SUCCESS: "Login successful! 🎉",
  LOGIN_REDIRECT: "Redirecting to Dashboard...",
  AUTH_HEADING: "AUTHORIZATION",
  AUTH_FAILED: "❌Not authorized for this page",
};

export const ICONPATH = {
  FOLDER: "/assets/icons/folder.svg",
  EMPTY_FOLDER: "/assets/icons/empty-folder.svg",
  FILE: "/assets/icons/file.svg",
  TRIANGLE: "/assets/icons/triangle.svg",
  EDIT: "/assets/icons/edit.svg",
  DOWNLOAD: "/assets/icons/download.svg",
  DELETE: "/assets/icons/trash.svg",
  NEW_FILE: "/assets/icons/new-file.svg",
  NEW_FOLDER: "/assets/icons/new-folder.svg",
};
