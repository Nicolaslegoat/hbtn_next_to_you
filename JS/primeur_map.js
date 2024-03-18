var mymap;
var magasins = [];
var storeMarkers = [];
var storeDropdown = document.getElementById('storeSelect');
var userLat;
var userLng;

function initializeMap() {
  mymap = L.map('map').setView([0, 0], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© NextToYou contributors'
  }).addTo(mymap);

  mymap.on('load', function () {
      console.log('Map tiles loaded successfully.');
  });

  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Rayon de la Terre en kilomètres
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


function addStoreMarker(store) {
    // Ajoutez une condition pour vérifier si la catégorie est égale à "Primeur"
    if (store.category === "Primeur") {
      var greenPointerIcon = L.icon({
          iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#5e8e7b" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>'),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
  
      var storeMarker = L.marker([store.latitude, store.longitude], {
          icon: greenPointerIcon
      }).addTo(mymap);

      // Calculer la distance
      var distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);

      // Convertir la distance en kilomètres si elle dépasse 1000 mètres
      var distanceText;
      if (distance >= 1000) {
          distance /= 1000;
          distanceText = `${distance.toFixed(2)} km`;
      } else {
          distanceText = `${distance.toFixed(2)} m`;
      }

      // Mettez l'unité de distance à la fin du texte
      storeMarker.bindPopup(`<b>${store.nom}</b><br><a href="magasin${store.id}.html">${store.nom}</a><br>Distance: ${distanceText}`).openPopup();

      storeMarker.on('mouseover', function (e) {
        this.openPopup();
    });

      storeMarker.on('click', function () {
          window.location.href = `magasin${store.id}.html`;
      });

      storeMarkers.push(storeMarker);

      var listItem = document.createElement('div');
      listItem.classList.add('store-list-item');

      // Mettez l'unité de distance à la fin du texte
      listItem.innerHTML = `<div class="store-info">${store.nom}</div><div class="distance">${distanceText}</div>`;

      listItem.addEventListener('click', function () {
          mymap.setView([store.latitude, store.longitude], 17);
      });

      document.getElementById('storeList').appendChild(listItem);
  }
}


function addUserMarker() {
var userIcon = L.icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 64A64 64 0 1 0 192 64a64 64 0 1 0 128 0zm-96 96c-35.3 0-64 28.7-64 64v48c0 17.7 14.3 32 32 32h1.8l11.1 99.5c1.8 16.2 15.5 28.5 31.8 28.5h38.7c16.3 0 30-12.3 31.8-28.5L318.2 304H320c17.7 0 32-14.3 32-32V224c0-35.3-28.7-64-64-64H224zM132.3 394.2c13-2.4 21.7-14.9 19.3-27.9s-14.9-21.7-27.9-19.3c-32.4 5.9-60.9 14.2-82 24.8c-10.5 5.3-20.3 11.7-27.8 19.6C6.4 399.5 0 410.5 0 424c0 21.4 15.5 36.1 29.1 45c14.7 9.6 34.3 17.3 56.4 23.4C130.2 504.7 190.4 512 256 512s125.8-7.3 170.4-19.6c22.1-6.1 41.8-13.8 56.4-23.4c13.7-8.9 29.1-23.6 29.1-45c0-13.5-6.4-24.5-14-32.6c-7.5-7.9-17.3-14.3-27.8-19.6c-21-10.6-49.5-18.9-82-24.8c-13-2.4-25.5 6.3-27.9 19.3s6.3 25.5 19.3 27.9c30.2 5.5 53.7 12.8 69 20.5c3.2 1.6 5.8 3.1 7.9 4.5c3.6 2.4 3.6 7.2 0 9.6c-8.8 5.7-23.1 11.8-43 17.3C374.3 457 318.5 464 256 464s-118.3-7-157.7-17.9c-19.9-5.5-34.2-11.6-43-17.3c-3.6-2.4-3.6-7.2 0-9.6c2.1-1.4 4.8-2.9 7.9-4.5c15.3-7.7 38.8-14.9 69-20.5z"/></svg>'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

var userMarker = L.marker([userLat, userLng], {
  icon: userIcon
}).addTo(mymap);

userMarker.bindPopup("<b>You are Here</b>").openPopup();
}

function fetchStoresData() {
    clearMap();

    console.log("Fetching stores data from PHP...");

    fetch('PHP/get_primeur.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received from PHP:", data);

            magasins = data;
            console.log("Magasins after fetching:", magasins);

            magasins.sort(function (a, b) {
                var distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
                var distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
                return distanceA - distanceB;
            });

            console.log("Magasins after sorting:", magasins);
            magasins.forEach(addStoreMarker);
            mymap.setView([userLat, userLng], 15); // Centre la carte sur votre position avec un zoom de 15

        })
        .catch(error => {
            console.error('Error fetching stores data:', error);
        })
}


function clearMap() {
    storeMarkers.forEach(marker => {
        marker.removeFrom(mymap);
    });

    var storeList = document.getElementById('storeList');
    while (storeList.firstChild) {
        storeList.removeChild(storeList.firstChild);
    }

    storeMarkers = [];
}

function onLocationSuccess(position) {
userLat = position.coords.latitude;
userLng = position.coords.longitude;

console.log("Latitude:", userLat);
console.log("Longitude:", userLng);

addUserMarker();
fetchStoresData();
}


  function onLocationError(error) {
      console.error(`Geolocation error: ${error.message}`);
  }

  document.addEventListener("DOMContentLoaded", function () {
initializeMap();
});