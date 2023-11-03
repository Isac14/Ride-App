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

  const firstPosition = ride.data[0];

  const firstLocationData = await getLocationData(
    firstPosition.latitude,
    firstPosition.longitude
  );

  const mapElement = document.createElement("div");
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
});

async function getLocationData(latitude, longitude) {
  const url = `http://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&=localityLanguage=en`;

  const response = await fetch(url);
  return await response.json();
}

function getMaxSpeed(positions) {
  let maxSpeed = 0;
  positions.forEach((position) => {
    if (position.speed != null && position.speed > maxSpeed) {
      maxSpeed = position.speed;
    }
  });

  return (maxSpeed * 3.6).toFixed(1);
}

function getDistance(positions) {
  const earthRadiousKm = 6371;
  let totalDistance = 0;
  for (let i = 0; i < positions.lenght - 1; i++) {
    const p1 = {
      latitude: positions[i].latitude,
      latitude: positions[i].longitude,
    };
    const p2 = {
      latitude: positions[i + 1].latitude,
      latitude: positions[i + 1].longitude,
    };

    const deltaLatitude = toRad(p2.latitude - p1.latitude);
    const deltaLongitude = toRad(p2.longitude - p1.longitude);

    const a =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
      Math.sin(deltaLongitude / 2) *
        Math.sin(deltaLongitude / 2) *
        Math.cos(toRad(p1.latitude)) *
        Math.cos(toRad(p2.latitude));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiousKm * c;

    totalDistance += distance;
  }

  function toRad(degree) {
    return (degree * Math.PI) / 180;
  }

  return totalDistance.toFixed(2);
}

function getDuration(ride) {
  function format(number, digits) {
    return String(number.toFixed(0)).padStart(2, "0");
  }

  const interval = (ride.stopTime - ride.startTime) / 1000;

  const minutes = Math.trunc(interval / 60);
  const seconds = interval % 60;

  return `${format(minutes, 2)}:${format(seconds, 2)}`;
}

function getStartDate(ride) {
  const d = new Date(ride.startTime);

  const day = d.toLocaleDateString("en-US", { day: "numeric" });
  const month = d.toLocaleDateString("pt-BR", { month: "long" });
  const year = d.toLocaleDateString("en-US", { year: "numeric" });

  return `${day} de ${month}, ${year}`;
}
