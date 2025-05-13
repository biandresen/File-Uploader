export async function patchRequest(path, body, failMsg) {
  try {
    const res = await fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(failMsg);

    return await res.json();
  } catch (err) {
    console.error(failMsg + ": " + err.message);
  }
}

export async function deleteRequest(path, failMsg) {
  try {
    const response = await fetch(path, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(failMsg);

    // 204 = No Content = No parsing needed
    if (response.status === 204) return;

    return await response.json();
  } catch (err) {
    console.error(failMsg + ": " + err.message);
  }
}
