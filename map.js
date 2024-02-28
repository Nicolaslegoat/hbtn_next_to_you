// map.js

var mymap;
var storeMarkers = [];
var storeDropdown = document.getElementById('storeSelect');

var magasins = [
    { id: 1, nom: 'Magasin 1', latitude: 48.858844, longitude: 2.294350 },
    { id: 2, nom: 'Magasin 2', latitude: 40.712776, longitude: -74.005974 },
    { id: 3, nom: 'Magasin 3', latitude: 34.052235, longitude: -118.243683 },
    { id: 4, nom: 'Magasin 4', latitude: 41.878113, longitude: -87.629799 },
    { id: 5, nom: 'Magasin 5', latitude: 51.507351, longitude: -0.127758 },
    { id: 6, nom: 'Magasin 6', latitude: 35.689487, longitude: 139.691711 },
    { id: 7, nom: 'Magasin 7', latitude: 37.774929, longitude: -122.419416 },
    { id: 8, nom: 'Magasin 8', latitude: 45.421529, longitude: -75.699340 },
    { id: 9, nom: 'Magasin 9', latitude: -33.868820, longitude: 151.209290 },
    { id: 10, nom: 'Magasin 10', latitude: 55.755825, longitude: 37.617298 },
    { id: 11, nom: 'Magasin 11', latitude: 40.416775, longitude: -3.703790 },
    { id: 12, nom: 'Magasin 12', latitude: 52.520008, longitude: 13.404954 },
    { id: 13, nom: 'Magasin 13', latitude: 45.464211, longitude: 9.191383 },
    { id: 14, nom: 'Magasin 14', latitude: 19.432608, longitude: -99.133209 },
    { id: 15, nom: 'Magasin 15', latitude: -23.550520, longitude: -46.633308 },
    // Ajoutez d'autres magasins au besoin
];

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

function initializeMap() {
    mymap = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© NextToYou contributors'
    }).addTo(mymap);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    fetchStoresData();
}

function onLocationSuccess(position) {
    var userLatlng = [position.coords.latitude, position.coords.longitude];

    mymap.setView(userLatlng, 13);

    var userMarker = L.marker(userLatlng, {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        })
    }).addTo(mymap);

    userMarker.bindPopup("<b>You are Here</b>").openPopup();
    fetchStoresData(position.coords.latitude, position.coords.longitude);

}

function onLocationError(error) {
    console.error(`Geolocation error: ${error.message}`);
}

function fetchStoresData(userLat, userLng) {

    clearMap();
    
    magasins.sort(function (a, b) {
        var distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
        var distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
        return distanceA - distanceB;
    });

    magasins.forEach(store => {
        var storeMarker = L.marker([store.latitude, store.longitude]).addTo(mymap);
        storeMarker.bindPopup(`<b>${store.nom}</b><br><a href="magasin${store.id}.html">${store.nom}</a>`).openPopup();

        storeMarker.on('click', function () {
            window.location.href = `magasin${store.id}.html`;
        });

        storeMarkers.push(storeMarker);

        var listItem = document.createElement('div');
        listItem.classList.add('store-list-item');
        listItem.innerText = store.nom;

        listItem.addEventListener('click', function () {
            mymap.setView([store.latitude, store.longitude], 13);
        });

        document.getElementById('storeList').appendChild(listItem);
    });
}

function clearMap() {
    // Retirer les anciens marqueurs de la carte
    storeMarkers.forEach(marker => {
        marker.removeFrom(mymap);
    });

    // Effacer la liste
    var storeList = document.getElementById('storeList');
    while (storeList.firstChild) {
        storeList.removeChild(storeList.firstChild);
    }

    // Réinitialiser le tableau de marqueurs
    storeMarkers = [];
}


document.addEventListener("DOMContentLoaded", function () {
    initializeMap();
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;
            fetchStoresData(userLat, userLng);
        }, onLocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});