isEditing = true;
const isFolder = content?.files ? true : false;
const editBtn = e.target.closest(".edit-name-btn");

if (editBtn) {
  const wrapper = editBtn.closest(".row-wrapper").parentElement.previousElementSibling;
  const span = wrapper.querySelector(`[data-id="${content.id}"]`);
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
    span.classList.remove("hide");
    const newName = input.value.trim();
    setTimeout(() => {
      isEditing = false;
    }, 200);

    if (!newName || newName === oldName) return;

    const apiPath = isFolder ? PATH.FOLDER_NAMEPATCH : PATH.FILE_NAMEPATCH;
    const res = await patchRequest(PATH.BASEURL + apiPath + content.id, {
      name: newName,
    });

    span.textContent = res.data.name;
  });
}
