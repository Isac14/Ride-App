const speedElement = document.querySelector("#speed");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");

let wachID = null;
let currentRide = null;

startBtn.addEventListener("click", () => {
  if (wachID) return;

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

  window.location.href = "../";
});
