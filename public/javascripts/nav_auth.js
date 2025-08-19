async function nav_based_on_user_auth() {
  const token = Cookies.get("token");

  if (token !== undefined) {
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
      if (res.auth === true) {
        document.getElementById("nonauth-user").style.display = "none";
        document.getElementById("auth-user").style.display = "block";
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}

window.onload = function () {
  nav_based_on_user_auth();
};
