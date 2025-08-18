async function check_user_auth() {
  const token = Cookies.get("token");
  console.log(token)
  if (token === undefined) {
    window.location.href = "/login";
    console.log("Not auth")
  } else {
    const url = "/api/auth";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();
      if (res.auth === false) {
        window.location.href = "/login";
      } else if (res.auth === true) {
        console.log("Auth is true");
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}

check_user_auth();
