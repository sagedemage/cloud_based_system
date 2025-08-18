function validate_email(email) {
  const regex = /^\S+@\S+\.\S+$/;
  const validate = email.match(regex);
  return validate;
}

async function register_user() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirm_pass = document.getElementById("cfm-pass").value;
  const validate = validate_email(email);

  if (
    email === "" ||
    username === "" ||
    password === "" ||
    confirm_pass === ""
  ) {
    document.getElementById("msg-alert").innerText = "Fields must be filled!";
    document.getElementById("msg-alert").style.display = "block";
  } else if (validate == null) {
    document.getElementById("msg-alert").innerText = "Invalid email format!";
    document.getElementById("msg-alert").style.display = "block";
  } else if (password !== confirm_pass) {
    document.getElementById("msg-alert").innerText = "Password do not match!";
    document.getElementById("msg-alert").style.display = "block";
  } else {
    const url = "/api/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();
      if (res.status === "Error") {
        document.getElementById("msg-alert").innerText = res.msg;
        document.getElementById("msg-alert").style.display = "block";
      } else if (res.status === "Success") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}

async function login_user() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (
    username === "" ||
    password === ""
  ) {
    document.getElementById("msg-alert").innerText = "Fields must be filled!";
    document.getElementById("msg-alert").style.display = "block";
  } else {
    const url = "/api/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();
      if (res.status === "Error") {
        document.getElementById("msg-alert").innerText = res.msg;
        document.getElementById("msg-alert").style.display = "block";
      } else if (res.status === "Success") {
        Cookies.set("token", res.token, {expires: 365})
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}

function logout() {
  Cookies.remove('token');
  window.location.reload();
}
