const rideListElemenst = document.querySelector("#rideList");
const allRides = getAllRides();

allRides.forEach(async ([id, value]) => {
  const ride = JSON.parse(value);
  ride.id = id;
  console.log(ride);

  const itemElement = document.createElement("li");
  itemElement.id = ride.id;
  itemElement.className =
    "d-flex p-1 align-items-center justify-content-center shadow-sm gap-3";
  rideListElemenst.appendChild(itemElement);

  itemElement.addEventListener("click", () => {
    window.location.href = `./details.html?id=${ride.id}`;
  });

  const firstPosition = ride.data[0];

  const firstLocationData = await getLocationData(
    firstPosition.latitude,
    firstPosition.longitude
  );

  const mapID = `map${ride.id}`;
  const mapElement = document.createElement("div");
  mapElement.id = mapID;
  mapElement.style = "width:100px;height:100px";
  mapElement.classList.add("bg-secondary");
  mapElement.classList.add("rounded-4");

  const dataElement = document.createElement("div");
  dataElement.className = "flex-fill d-flex flex-column";

  const cityDiv = document.createElement("div");
  cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`;
  cityDiv.className = "text-primary mb-2";

  const maxSpeedDiv = document.createElement("div");
  maxSpeedDiv.innerText = `Max Speed: ${getMaxSpeed(ride.data)} km/h`;
  maxSpeedDiv.className = "h5";

  const distanceDiv = document.createElement("div");
  distanceDiv.innerText = `Distance: ${getDistance(ride.data)} km`;

  const durationDiv = document.createElement("div");
  durationDiv.innerText = `Duration: ${getDuration(ride)} `;
  durationDiv.className = "";

  const dateDiv = document.createElement("div");
  dateDiv.innerText = `Date: ${getStartDate(ride)}`;
  dateDiv.className = "text-secondary mt-2";

  dataElement.appendChild(cityDiv);
  dataElement.appendChild(maxSpeedDiv);
  dataElement.appendChild(distanceDiv);
  dataElement.appendChild(durationDiv);
  dataElement.appendChild(dateDiv);

  itemElement.append(mapElement);
  itemElement.append(dataElement);

  const map = L.map(mapID, {
    attributionControl: false,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
  });
  map.setView([firstPosition.latitude, firstPosition.longitude], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 5,
    maxZoom: 20,
  }).addTo(map);

  L.marker([firstPosition.latitude, firstPosition.longitude]).addTo(map);
});
