

var mymap;
var magasins = [];
var storeMarkers = [];
var storeDropdown = document.getElementById('storeSelect');



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

    // Ajoutez le gestionnaire d'événements 'load' ici
    mymap.on('load', function () {
        console.log('Map tiles loaded successfully.');
    });

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

}

function onLocationSuccess(position) {
    var userLat = position.coords.latitude;
    var userLng = position.coords.longitude;

    console.log("Latitude:", userLat);
    console.log("Longitude:", userLng);

    mymap.setView([userLat, userLng], 13);

    var userMarker = L.marker([userLat, userLng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        })
    }).addTo(mymap);

    userMarker.bindPopup("<b>You are Here</b>").openPopup();
    fetchStoresDataFromPHP(userLat, userLng);
}

function onLocationError(error) {
    console.error(`Geolocation error: ${error.message}`);
}

function fetchStoresDataFromPHP(userLat, userLng) {
    clearMap();

    console.log("Fetching stores data from PHP...");

    // Utilisez fetch pour simplifier la récupération des données
    fetch('get_magasins.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Assurez-vous que les données sont correctement récupérées
            console.log("Data received from PHP:", data);

            // Assurez-vous que les données sont correctement ajoutées à magasins
            magasins = data;
            console.log("Magasins after fetching:", magasins);

            // Ajoutez d'abord les marqueurs pour la localisation de l'utilisateur
            var userMarker = L.marker([userLat, userLng], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                })
            }).addTo(mymap);

            userMarker.bindPopup("<b>You are Here</b>").openPopup();

            // Triez et affichez les magasins après avoir ajouté le marqueur utilisateur
            magasins.sort(function (a, b) {
                var distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
                var distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
                return distanceA - distanceB;
            });

            console.log("Magasins after sorting:", magasins);
            magasins.forEach(store => {
                console.log("Adding marker for store:", store);
                
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
            })

        })
        .catch(error => {
            console.error('Error fetching stores data:', error);
        });
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


document.addEventListener("DOMContentLoaded", function () {
    initializeMap();

    if (mymap.getCenter().lat !== userLat || mymap.getCenter().lng !== userLng) {
        mymap.setView([store.latitude, store.longitude], 13);
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;
            fetchStoresDataFromPHP(userLat, userLng);
        }, onLocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});
