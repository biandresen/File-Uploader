import { user } from "./user.js";
import { $, $create } from "./utils.js";
import { ICONPATH } from "./constants.js";

const dashboardNav = $("#dashboard-nav");
const topFolderList = $("#top-folder-list");
const contentList = $("#content-list");

export function renderDashboard() {
  console.log("USER DATA: ", user.data);
  dashboardNav.classList.remove("hide");

  topFolderList.innerHTML = ""; // Optional: clear list before rendering

  user.data.forEach((topFolder) => {
    const topFolderItem = $create("li");

    const topFolderRowWrapper = $create("div");
    topFolderRowWrapper.classList.add("row-wrapper");

    const topFolderShowBtn = $create("button");
    topFolderShowBtn.dataset.btn = topFolder.name;
    topFolderShowBtn.classList.add("icon-btn", "show-content-btn");
    topFolderShowBtn.addEventListener("click", (e) => {
      const contentName = e.currentTarget.dataset.btn;
      const content = user.data.find((item) => item.name === contentName);

      if (!content) return;
      renderContent(content);

      // Remove highlight from all row wrappers
      document
        .querySelectorAll(".row-wrapper.folder-highlight")
        .forEach((el) => el.classList.remove("folder-highlight"));
      // Add highlight to the current one
      topFolderRowWrapper.classList.add("folder-highlight");
    });

    const topFolderIcon = $create("img");
    topFolderIcon.src = ICONPATH.FOLDER;

    const topFolderName = $create("span");
    topFolderName.textContent = topFolder.name;

    const topFolderEditBtn = $create("button");
    topFolderEditBtn.type = "button";
    topFolderEditBtn.classList.add("icon-btn", "edit-name-btn");

    const editIcon = $create("img");
    editIcon.src = ICONPATH.EDIT;

    // Assemble
    topFolderShowBtn.append(topFolderIcon, topFolderName);
    topFolderEditBtn.appendChild(editIcon);
    topFolderRowWrapper.append(topFolderShowBtn, topFolderEditBtn);
    topFolderItem.appendChild(topFolderRowWrapper);
    topFolderList.appendChild(topFolderItem);
  });
}

function renderContent(content) {
  // Clear old content if needed
  contentList.innerHTML = "";

  const folders = content.children;
  const files = content.files;

  const folderItems = folders?.map((folder) => assembleContentItem(folder, true)) || [];
  const fileItems = files?.map((file) => assembleContentItem(file, false)) || [];

  folderItems.length && contentList.append(...folderItems);
  fileItems.length && contentList.append(...fileItems);
}

function assembleContentItem(content, folder) {
  // Create structure
  const contentItem = $create("li");

  const contentColumnWrapper = $create("div");
  contentColumnWrapper.classList.add("column-wrapper");

  const contentFileWrapper = $create("div");
  contentFileWrapper.classList.add("file", "row-wrapper");

  const contentShowBtn = $create("button");
  contentShowBtn.dataset.btn = content.name;
  contentShowBtn.classList.add("icon-btn", "show-content-btn");

  folder &&
    contentShowBtn.addEventListener("click", () => {
      renderContent(content);
    });

  const contentImg = $create("img");
  contentImg.alt = "folder";
  if (content?.files || content?.children) {
    contentImg.src = ICONPATH.FOLDER;
  } else if (folder) {
    contentImg.src = ICONPATH.EMPTY_FOLDER;
  } else {
    contentImg.src = ICONPATH.FILE;
  }

  const contentSpan = $create("span");
  contentSpan.textContent = `${content.name}${content.extension ? "." + content.extension : ""}`;

  const contentExpandBtn = $create("button");
  contentExpandBtn.classList.add("icon-btn", "file-expand-btn");

  const contentExpandIcon = $create("img");
  contentExpandIcon.classList.add("triangle");
  contentExpandIcon.src = ICONPATH.TRIANGLE;
  contentExpandIcon.alt = "expand";

  const contentFileMenu = $create("div");
  contentFileMenu.classList.add("file-menu", "column-wrapper");

  const contentRowWrapper = $create("div");
  contentRowWrapper.classList.add("row-wrapper");

  const contentQty = $create("p");
  contentQty.textContent = content.files?.length ?? " ";

  const contentCreated = $create("p");
  contentCreated.textContent = content.createdAt?.split("T")[0] ?? "-";

  const contentSize = $create("p");

  contentSize.textContent = folder ? " ----- " : (content.size.toFixed(1) + "kb" ?? " ----- ");

  const contentRowWrapper2 = $create("div");
  contentRowWrapper2.classList.add("row-wrapper");

  const contentDownloadBtn = $create("button");
  contentDownloadBtn.classList.add("icon-btn", "download-btn");
  const contentDownloadIcon = $create("img");
  contentDownloadIcon.src = ICONPATH.DOWNLOAD;
  contentDownloadIcon.alt = "Download";

  !folder &&
    contentDownloadBtn.addEventListener("click", () => {
      const downloadLink = content.link;
      getFile(downloadLink);
    });

  const contentEditBtn = $create("button");
  contentEditBtn.classList.add("icon-btn", "edit-name-btn");
  const contentEditIcon = $create("img");
  contentEditIcon.src = ICONPATH.EDIT;
  contentEditIcon.alt = "Edit";

  const contentDeleteBtn = $create("button");
  contentDeleteBtn.classList.add("icon-btn", "delete-btn");
  const contentDeleteIcon = $create("img");
  contentDeleteIcon.src = ICONPATH.DELETE;
  contentDeleteIcon.alt = "Delete";

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
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up memory
}
