import { user } from "./user.js";
import { $, $create } from "./utils.js";
import { ICONPATH, PATH } from "./constants.js";

const dashboardNav = $("#dashboard-nav");
const topFolderList = $("#top-folder-list");
const contentList = $("#content-list");

export function renderDashboard() {
  console.log("USER DATA: ", user.data);
  dashboardNav.classList.remove("hide");

  topFolderList.innerHTML = ""; // Optional: clear list before rendering

  let isEditing = false;

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

    const topFolderIcon = $create("img", { src: ICONPATH.FOLDER });

    const topFolderName = $create("span", { class: [topFolder.name], text: topFolder.name });

    const topFolderEditBtn = $create("button", { class: ["icon-btn", "edit-name-btn"] });

    topFolderEditBtn.addEventListener("click", async (e) => {
      isEditing = true;

      const editBtn = e.target.closest(".edit-name-btn");

      if (editBtn) {
        editBtn.classList.add("hide");
        const wrapper = editBtn.closest(".row-wrapper");
        const span = wrapper.querySelector("." + topFolder.name);

        const oldName = span.textContent;
        const folderId = wrapper.dataset.id;

        // Replace span with input + ok button
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
          const newName = input.value.trim();
          if (!newName || newName === oldName) return;

          try {
            const response = await fetch(PATH.BASEURL + PATH.FOLDER_NAMEPATCH + folderId, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) throw new Error("Rename failed");

            const updatedFolder = await response.json();

            // Replace input with new span
            input.remove();
            okBtn.remove();

            editBtn.classList.remove("hide");
            span.classList.remove("hide");
            span.textContent = updatedFolder.data.updatedFolder.name;

            isEditing = false;

            // Optional: refetch user data if needed
            // await fetchUserData();
          } catch (err) {
            alert("Could not rename folder: " + err.message);
          }
        });
      }
    });

    const editIcon = $create("img", { src: ICONPATH.EDIT });

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

  const contentColumnWrapper = $create("div", { class: ["column-wrapper"] });

  const contentFileWrapper = $create("div", { class: ["file", "row-wrapper"] });

  const contentShowBtn = $create("button", {
    class: ["icon-btn", "show-content-btn"],
    data: { btn: content.name },
  });

  folder &&
    contentShowBtn.addEventListener("click", () => {
      renderContent(content);
    });

  const contentImg = $create("img");

  if (content?.files || content?.children) {
    contentImg.src = ICONPATH.FOLDER;
  } else if (folder) {
    contentImg.src = ICONPATH.EMPTY_FOLDER;
  } else {
    contentImg.src = ICONPATH.FILE;
  }

  const contentSpan = $create("span");
  contentSpan.textContent = `${content.name}${content.extension ? "." + content.extension : ""}`;

  const contentExpandBtn = $create("button", { class: ["icon-btn", "file-expand-btn"] });

  const contentExpandIcon = $create("img", { class: ["triangle"], src: ICONPATH.TRIANGLE });

  const contentFileMenu = $create("div", { class: ["file-menu", "column-wrapper"] });

  const contentRowWrapper = $create("div", { class: ["row-wrapper"] });

  const contentQty = $create("p");
  contentQty.textContent = content.files?.length ?? " ";

  const contentCreated = $create("p");
  contentCreated.textContent = content.createdAt?.split("T")[0] ?? "-";

  const contentSize = $create("p");
  contentSize.textContent = folder ? " ----- " : (content.size.toFixed(1) + "kb" ?? " ----- ");

  const contentRowWrapper2 = $create("div", { class: ["row-wrapper"] });
  const contentDownloadBtn = $create("button", { class: ["icon-btn", "download-btn"] });
  const contentDownloadIcon = $create("img", { src: ICONPATH.DOWNLOAD });

  !folder &&
    contentDownloadBtn.addEventListener("click", () => {
      const downloadLink = content.link;
      getFile(downloadLink);
    });

  const contentEditBtn = $create("button", { class: ["icon-btn", "edit-name-btn"] });
  const contentEditIcon = $create("img", { src: ICONPATH.EDIT });

  const contentDeleteBtn = $create("button", { class: ["icon-btn", "delete-btn"] });
  const contentDeleteIcon = $create("img", { src: ICONPATH.DELETE });

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
