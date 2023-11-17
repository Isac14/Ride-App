const speedElement = document.querySelector("#speed");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");

let wachID = null;
let currentRide = null;
let wakeLock = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      console.log("Wake Lock foi liberado");
    });
    console.log("Wake Lock está ativo");
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

startBtn.addEventListener("click", () => {
  if (wachID) return;
  requestWakeLock();

  function handleSuccess(position) {
    addPosition(currentRide, position);
    console.log(position);
    speedElement.innerText = position.coords.speed
      ? (position.coords.speed * 3.6).toFixed(1)
      : 0;
  }

  function handleError(error) {
    console.log(error.msg);
  }

  const options = { enableHighAccuracy: true };

  currentRide = createNewRide();

  wachID = navigator.geolocation.watchPosition(
    handleSuccess,
    handleError,
    options
  );

  startBtn.classList.add("d-none");
  stopBtn.classList.remove("d-none");
});

stopBtn.addEventListener("click", () => {
  if (!wachID) return;
  navigator.geolocation.clearWatch(wachID);
  wachID = null;
  updateStopTime(currentRide);
  currentRide = null;
  startBtn.classList.remove("d-none");
  stopBtn.classList.add("d-none");

  window.location.href = "./";

  if (wakeLock !== null) {
    wakeLock
      .release()
      .then(() => {
        wakeLock = null;
        console.log("Wake Lock foi liberado");
      })
      .catch((err) => {
        console.error(`${err.name}, ${err.message}`);
      });
  }
});
