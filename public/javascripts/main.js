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

  if (username === "" || password === "") {
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
        Cookies.set("token", res.token, { expires: 365 });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}

function logout() {
  Cookies.remove("token");
  window.location.reload();
}

function handle_dropdown() {
  let display = document.getElementById("dropdown-content").style.display;
  if (display == "" || display == "none") {
    document.getElementById("dropdown-content").style.display = "block";
  } else if (display == "block") {
    document.getElementById("dropdown-content").style.display = "none";
  }
}

window.onclick = function (event) {
  if (!event.target.matches(".dropdown-btn")) {
    document.getElementById("dropdown-content").style.display = "none";
  }
};

async function get_user_id() {
  const token = Cookies.get("token");
  let user_id = 0;
  if (token === undefined) {
    return null
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
        return null
      } else if (res.auth === true) {
        user_id = res.user_id;
      }
    } catch (error) {
      return null
    }
  }
  return user_id
}

async function add_wave() {
  const frequency_str = document.getElementById("frequency").value;
  const frequency = parseInt(frequency_str);
  const frequency_meas = document.getElementById("frequency_meas").value;
  const wavelength_str = document.getElementById("wavelength").value;
  const wavelength = parseInt(wavelength_str);
  const wavelength_meas = document.getElementById("wavelength_meas").value;
  const signal_modulation = document.getElementById("signal_modulation").value;
  const user_id = await get_user_id();

  if (frequency === "" || wavelength === "") {
    document.getElementById("msg-alert").innerText = "Fields must be filled!";
    document.getElementById("msg-alert").style.display = "block";
  } else if (user_id === null) {
    document.getElementById("msg-alert").innerText = "User must be authenticated!";
    document.getElementById("msg-alert").style.display = "block";
  } else {
    const url = "/api/add-wave";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frequency: frequency,
          frequency_meas: frequency_meas,
          wavelength: wavelength,
          wavelength_meas: wavelength_meas,
          signal_modulation: signal_modulation,
          user_id: user_id,
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
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}

async function edit_wave() {
  const searchParams = new URLSearchParams(window.location.search);
  const wave_id = parseInt(searchParams.get("wave-id"));

  const frequency_str = document.getElementById("frequency").value;
  const frequency = parseInt(frequency_str);
  const frequency_meas = document.getElementById("frequency_meas").value;
  const wavelength_str = document.getElementById("wavelength").value;
  const wavelength = parseInt(wavelength_str);
  const wavelength_meas = document.getElementById("wavelength_meas").value;
  const signal_modulation = document.getElementById("signal_modulation").value;

  if (frequency === "" || wavelength === "") {
    document.getElementById("msg-alert").innerText = "Fields must be filled!";
    document.getElementById("msg-alert").style.display = "block";
  } else {
    const url = "/api/edit-wave";
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wave_id: wave_id,
          frequency: frequency,
          frequency_meas: frequency_meas,
          wavelength: wavelength,
          wavelength_meas: wavelength_meas,
          signal_modulation: signal_modulation,
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
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}
