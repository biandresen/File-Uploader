import { user } from "./user.js";
import { $, $create } from "./utils.js";
import { ICONPATH, PATH } from "./constants.js";
import { patchRequest, deleteRequest } from "./api/patch-api.js";

const dashboardNav = $("#dashboard-nav");
const topFolderList = $("#top-folder-list");
const contentList = $("#content-list");
const topFoldersNavBtn = $("#top-folders-nav-btn");
const dashboardNavBtn = $("#dashboard-nav-btn");
let isEditing = false;

topFoldersNavBtn.addEventListener("click", toggleDashboardNav);
dashboardNavBtn.addEventListener("click", toggleDashboardNav);

function toggleDashboardNav() {
  dashboardNav.classList.toggle("closed");
}

export function renderDashboard() {
  topFolderList.innerHTML = "";

  user.data.forEach((topFolder) => {
    const topFolderItem = $create("li");
    const topFolderRowWrapper = $create("div", {
      class: ["row-wrapper"],
      data: { id: topFolder.id },
    });
    const topFolderShowBtn = $create("button", {
      class: ["icon-btn", "show-content-btn"],
      data: { id: topFolder.id },
    });
    const topFolderIcon = $create("img", { src: ICONPATH.FOLDER });
    const topFolderName = $create("span", { data: { id: topFolder.id }, text: topFolder.name });
    const topFolderEditBtn = $create("button", { class: ["icon-btn", "edit-name-btn"] });
    const editIcon = $create("img", { src: ICONPATH.EDIT });
    const deleteIcon = $create("img", { src: ICONPATH.DELETE });
    const topFolderDeleteBtn = $create("button", {
      class: ["icon-btn", "delete-btn"],
      data: { id: topFolder.id },
    });

    topFolderDeleteBtn.addEventListener("click", async (e) => {
      handleDeleteContent(e, topFolder);
    });

    topFolderEditBtn.addEventListener("click", async (e) => {
      handleEditName(e, topFolder, true);
    });

    topFolderShowBtn.addEventListener("click", (e) => {
      const isActive = topFolderRowWrapper.classList.contains("folder-highlight");
      if (isActive || isEditing) return;

      const contentId = e.currentTarget.dataset.id;
      const content = user.data.find((item) => item.id === Number(contentId));

      if (!content) return;
      renderContent(content);

      // Remove highlight from all row wrappers
      document
        .querySelectorAll(".row-wrapper.folder-highlight")
        .forEach((el) => el.classList.remove("folder-highlight"));
      // Add highlight to the current one
      topFolderRowWrapper.classList.add("folder-highlight");
    });

    // Assemble
    topFolderDeleteBtn.appendChild(deleteIcon);
    topFolderShowBtn.append(topFolderIcon, topFolderName);
    topFolderEditBtn.appendChild(editIcon);
    topFolderRowWrapper.append(topFolderShowBtn, topFolderEditBtn, topFolderDeleteBtn);
    topFolderItem.appendChild(topFolderRowWrapper);
    topFolderList.appendChild(topFolderItem);
  });
}

function handleEditName(e, content, isTopFolder) {
  isEditing = true;
  const isFolder = content?.files ? true : false;
  const editBtn = e.target.closest(".edit-name-btn");
  const deleteBtn = e.target.parentElement.querySelector(".delete-btn");

  deleteBtn && deleteBtn.classList.add("hide");

  if (editBtn) {
    isTopFolder && editBtn.classList.add("hide");
    const wrapper =
      isTopFolder ?
        editBtn.closest(".row-wrapper")
      : editBtn.closest(".row-wrapper").parentElement.previousElementSibling;
    const span = wrapper.querySelector(`span[data-id="${content.id}"]`);
    console.log(span);
    const oldName = span.textContent;

    const input = $create("input", {
      type: "text",
      value: oldName,
      class: ["rename-input"],
    });

    const okBtn = $create("button", {
      text: "OK",
      class: ["ok-btn"],
    });

    const spanParent = span.parentElement;
    span.classList.add("hide");
    spanParent.append(input, okBtn);

    okBtn.addEventListener("click", async () => {
      input.remove();
      okBtn.remove();
      editBtn.classList.remove("hide");
      deleteBtn && deleteBtn.classList.remove("hide");
      span.classList.remove("hide");
      const newName = input.value.trim();
      setTimeout(() => {
        isEditing = false;
      }, 200);

      if (!newName || newName === oldName) return;

      const path = isFolder || isTopFolder ? PATH.FOLDER_NAMEPATCH : PATH.FILE_NAMEPATCH;
      const res = await patchRequest(
        PATH.BASEURL + path + content.id,
        { name: newName },
        "Failed to edit name of content"
      );

      span.textContent = res.data.name;
    });
  }
}

async function handleDeleteContent(e, content) {
  const contentItem = e.target.closest("li");
  contentItem && contentItem.remove();

  const isFolder = content?.files ? true : false;

  if (isFolder && content.parentId === null) {
    contentList.innerHTML = "";
  }

  const path = isFolder ? PATH.FOLDER_DELETE : PATH.FILE_DELETE;

  await deleteRequest(PATH.BASEURL + path + content.id, "Failed to delete content");
}

function renderContent(content) {
  // Clear old content if needed
  contentList.innerHTML = "";

  const folders = content.children;
  const files = content.files;

  const folderItems = folders?.map((folder) => createContentItems(folder, true)) || [];
  const fileItems = files?.map((file) => createContentItems(file, false)) || [];

  folderItems.length && contentList.append(...folderItems);
  fileItems.length && contentList.append(...fileItems);
}

function createContentItems(content, folder) {
  const folderIsEmpty = content?.files?.length > 0 || content?.children?.length > 0;

  // Create structure
  const contentItem = $create("li");
  const contentColumnWrapper = $create("div", { class: ["column-wrapper"] });
  const contentFileWrapper = $create("div", { class: ["file", "row-wrapper"], data: { id: content.id } });
  const contentImg = $create("img");
  const contentSpan = $create("span", { data: { id: content.id } });
  contentSpan.textContent = `${content.name}${content.extension ? "." + content.extension : ""}`;
  const contentExpandIcon = $create("img", { class: ["triangle"], src: ICONPATH.TRIANGLE });
  const contentFileMenu = $create("div", { class: ["file-menu", "column-wrapper"] });
  const contentRowWrapper = $create("div", { class: ["row-wrapper"] });
  const contentExpandBtn = $create("button", { class: ["icon-btn", "file-expand-btn"] });
  const contentQty = $create("p");
  contentQty.textContent = content.files?.length ?? " ";
  const contentCreated = $create("p");
  contentCreated.textContent = content.createdAt?.split("T")[0] ?? "-";
  const contentSize = $create("p");
  contentSize.textContent = folder ? " ----- " : (content.size.toFixed(1) + "kb" ?? " ----- ");
  const contentRowWrapper2 = $create("div", { class: ["row-wrapper"] });
  const contentDownloadBtn = $create("button", { class: ["icon-btn", "download-btn"] });
  const contentDownloadIcon = $create("img", { src: ICONPATH.DOWNLOAD });
  const contentEditBtn = $create("button", { class: ["icon-btn", "edit-name-btn"] });
  const contentDeleteBtn = $create("button", { class: ["icon-btn", "delete-btn"], data: { id: content.id } });
  const contentDeleteIcon = $create("img", { src: ICONPATH.DELETE });
  const contentEditIcon = $create("img", { src: ICONPATH.EDIT });
  const contentShowBtn = $create("button", {
    class: ["icon-btn", "show-content-btn"],
    data: { btn: content.name },
  });

  contentDeleteBtn.addEventListener("click", async (e) => {
    handleDeleteContent(e, content);
  });

  if (folderIsEmpty) {
    contentShowBtn.addEventListener("click", () => {
      !isEditing && renderContent(content);
    });
    contentImg.src = ICONPATH.FOLDER;
  } else if (folder) {
    contentImg.src = ICONPATH.EMPTY_FOLDER;
  } else {
    contentImg.src = ICONPATH.FILE;
  }

  contentExpandBtn.addEventListener("click", () => {
    contentFileMenu.classList.toggle("open");
    contentExpandIcon.classList.toggle("rotate180");
  });

  !folder &&
    contentDownloadBtn.addEventListener("click", () => {
      const downloadLink = content.link;
      getFile(downloadLink);
    });

  contentEditBtn.addEventListener("click", (e) => {
    handleEditName(e, content, false);
  });

  // Assemble
  contentShowBtn.append(contentImg, contentSpan);
  contentExpandBtn.append(contentExpandIcon);
  contentFileWrapper.append(contentShowBtn, contentExpandBtn);
  contentRowWrapper.append(contentQty, contentCreated, contentSize ?? null);
  contentFileMenu.append(contentRowWrapper);
  !folder && contentDownloadBtn.append(contentDownloadIcon);
  contentDeleteBtn.append(contentDeleteIcon);
  contentEditBtn.append(contentEditIcon);
  contentRowWrapper2.append(contentDownloadBtn ?? null, contentEditBtn, contentDeleteBtn);
  contentFileMenu.append(contentRowWrapper2);
  contentColumnWrapper.append(contentFileWrapper, contentFileMenu);
  contentItem.append(contentColumnWrapper);

  return contentItem;
}

async function getFile(link) {
  try {
    const res = await fetch(link, {
      method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch file");

    const blob = await res.blob();

    // Try to extract a filename from the link
    const filename = link.split("/").pop()?.split("?")[0] || "download";

    downloadFile(blob, filename);
  } catch (err) {
    console.error("Download error:", err);
  }
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = $create("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up memory
}
