async function patchRequest(path, body, failMsg) {
  try {
    const response = await fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(failMsg);

    return await response.json();
  } catch (err) {
    alert(failMsg + ": " + err.message);
  }
}

export default patchRequest;
