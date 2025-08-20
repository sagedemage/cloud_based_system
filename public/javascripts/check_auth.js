async function check_user_auth() {
  const token = Cookies.get("token");
  if (token === undefined) {
    window.location.href = "/login";
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
      } 
    } catch (error) {
      console.error(error.message);
    }
  }
}

check_user_auth();
