import { $, $create } from "./utils.js";
import { ICONPATH, PATH } from "./constants.js";
import modal from "./modal.js";
import { user } from "./user.js";
import { renderDashboard } from "./dashboardPage.js";

const formModal = $("#form-modal");

formModal.addEventListener("click", (e) => {
  if (e.target === formModal) formModal.close();
});

// get folders
// insert folders into option elements to chose where to put the new file/folder
//* FOLDERS
// the selection must show the options: top (where the top folders are) and all folders
// top just creates a new folder with parentId=null, other folders sets the parentId to the id of the folder
//* FILES
// Show folder options except top. Sets the file to have the folderId as the selected folder

// prisma.create(data: {})

const fileCreation = {
  init() {
    this.newFileForm = $("#new-file-form");
    this.nameInput = $("#fileName");
    this.fileInput = $("#fileUpload");
    // this.linkInput = $("#fileLink");
    // this.extensionInput = $("#fileExtension");
    // this.sizeInput = $("#fileSize");
    this.placementInput = $("#filePlacement");
    this.newFileBtn = $("#new-file-btn");
    this.newFileForm.addEventListener("submit", (e) => this.createFile(e));

    return this;
  },
  createFile: async function (e) {
    e.preventDefault();
    const loadingSpinner = $create("div", { id: "loading-spinner" });
    this.newFileForm.appendChild(loadingSpinner);

    const formData = new FormData();
    formData.append("name", this.nameInput.value);
    formData.append("file", this.fileInput.files[0]);
    const selectedOption = this.placementInput.options[this.placementInput.selectedIndex];
    formData.append("folderId", selectedOption.dataset.id);

    try {
      const res = await fetch(PATH.BASEURL + PATH.FILE_CREATE, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error uploading file");

      const data = await res.json();

      // Reset form
      this.nameInput.value = "";
      this.fileInput.value = "";
      createNewContent.reRenderFormSelectOptions();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      loadingSpinner.remove();
    }
  },
};

const folderCreation = {
  init() {
    this.newFolderForm = $("#new-folder-form");
    this.nameInput = $("#folderName");
    this.placementInput = $("#folderPlacement");
    this.newFolderBtn = $("#new-folder-btn");
    this.newFolderForm.addEventListener("submit", (e) => this.createFolder(e));

    return this;
  },
  createFolder: async function (e) {
    e.preventDefault();
    const name = this.nameInput.value;
    const selector = this.placementInput;
    const selectedOption = selector.options[selector.selectedIndex];
    let folderId = selectedOption.dataset.id;

    // Convert folderId to number or null
    if (folderId === "null") folderId = null;
    else folderId = Number(folderId);

    console.log({ name, folderId });
    const res = await fetch(PATH.BASEURL + PATH.FOLDER_CREATE, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        id: folderId,
      }),
    });

    if (!res.ok) throw new Error("Error creating new folder");

    this.nameInput.value = "";
    createNewContent.reRenderFormSelectOptions();
  },
};

const createNewContent = {
  init: async function () {
    this.fileModule = fileCreation.init();
    this.folderModule = folderCreation.init();

    this.allFolders = await user.getAllFolders();
    this.attachFoldersToForms();

    this.closeFormBtn = $("#close-form-btn");
    this.closeFormBtn.addEventListener("click", () => formModal.close());
    this.createNewBtn = $("#create-new-btn");
    this.createNewBtn.addEventListener("click", () => this.openModal());
    this.newFileIcon = $create("img", { src: ICONPATH.NEW_FILE });
    this.newFileSpan = $create("span", { text: "New File" });
    this.newFileBtn = $create("button", {
      class: ["icon-btn", "create-btn"],
      children: [this.newFileIcon, this.newFileSpan],
    });
    this.newFileBtn.addEventListener("click", () => this.openNewFileForm());
    this.newFolderIcon = $create("img", { src: ICONPATH.NEW_FOLDER });
    this.newFolderSpan = $create("span", { text: "New Folder" });
    this.newFolderBtn = $create("button", {
      class: ["icon-btn", "create-btn"],
      children: [this.newFolderIcon, this.newFolderSpan],
    });
    this.newFolderBtn.addEventListener("click", () => this.openNewFolderForm());
    this.createNewWrapper = $create("div", {
      class: ["column-wrapper", "create-new-wrapper"],
      children: [this.newFileBtn, this.newFolderBtn],
    });

    this.newFileSection = $("#new-file-section");
    this.newFolderSection = $("#new-folder-section");

    return this;
  },
  openModal() {
    modal.showElement(this.createNewWrapper);
  },
  openNewFileForm() {
    this.newFileSection.classList.remove("hide");
    this.newFolderSection.classList.add("hide");
    formModal.showModal();
    formModal.querySelector(`input[id="fileName"]`).focus();
  },
  openNewFolderForm() {
    this.newFolderSection.classList.remove("hide");
    this.newFileSection.classList.add("hide");
    formModal.showModal();
    formModal.querySelector(`input[id="folderName"]`).focus();
  },
  reRenderFormSelectOptions: async function () {
    formModal.close();
    renderDashboard();
    this.allFolders = await user.getAllFolders();
    this.fileModule.placementInput.innerHTML = "";
    this.folderModule.placementInput.innerHTML = "";
    this.attachFoldersToForms();
  },
  attachFoldersToForms() {
    // Create fresh <option> elements for the file form
    const fileOptions = this.allFolders.map((folder) => {
      const depth = getFolderDepth(folder, this.allFolders);
      const prefix = "-".repeat(depth);
      const optionText = `${prefix} ${folder.name}`;
      return $create("option", { text: optionText, data: { id: folder.id } });
    });

    // Create fresh <option> elements for the folder form
    const folderOptions = this.allFolders.map((folder) => {
      const depth = getFolderDepth(folder, this.allFolders);
      const prefix = "-".repeat(depth);
      const optionText = `${prefix} ${folder.name}`;
      return $create("option", { text: optionText, data: { id: folder.id } });
    });

    const optionTopLevel = $create("option", {
      text: "Top level",
      data: { id: null },
    });
    folderOptions.unshift(optionTopLevel);

    this.fileModule.placementInput.append(...fileOptions);
    this.folderModule.placementInput.append(...folderOptions);
  },
};

function getFolderDepth(folder, allFolders) {
  let depth = 0;
  while (folder.parentId) {
    folder = allFolders.find((f) => f.id === folder.parentId);
    if (!folder) break; // safety check
    depth++;
  }
  return depth;
}

export default createNewContent;
