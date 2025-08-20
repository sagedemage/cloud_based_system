async function get_wave_data() {
  const searchParams = new URLSearchParams(window.location.search);
  const wave_id_str = searchParams.get("wave-id");

  if (
    wave_id_str === null ||
    wave_id_str === "" ||
    isNaN(wave_id_str) === true
  ) {
    location.href = "/dashboard";
  } else {
    const wave_id = parseInt(wave_id_str);
    const url = "/api/get-wave";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wave_id: wave_id,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();

      document.getElementById("frequency").value = res.frequency;
      document.getElementById("frequency_meas").value = res.frequency_meas;
      document.getElementById("wavelength").value = res.wavelength;
      document.getElementById("wavelength_meas").value = res.wavelength_meas;
      document.getElementById("signal_modulation").value =
        res.signal_modulation;
    } catch (error) {
      console.error(error.message);
    }
  }
}

get_wave_data();
