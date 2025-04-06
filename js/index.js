/**ce code requière jquery */
let map = L.map('map').setView([48.8566, 2.3522], 13)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
let marker = L.marker([48.8566, 2.3522], { draggable: true }).addTo(map);

marker.on('dragend', function (e) {
    let position = e.target.getLatLng();
    updateLatLng(position.lat, position.lng);
});

map.on('click', function (e) {
    marker.setLatLng(e.latlng);
    updateLatLng(e.latlng.lat, e.latlng.lng);
});

// Ajouter le champ de recherche sur la carte
let geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
}).on('markgeocode', function(e) {
    let latlng = e.geocode.center;
    map.setView(latlng, 15);
    marker.setLatLng(latlng);
    updateLatLng(latlng.lat, latlng.lng);
}).addTo(map);

//mettre à jour les champs latitude et longitude
function updateLatLng(lat, lng) {
    $("#latitude").val(lat)
    $("#longitude").val(lng)
}
//rechercher sa position
function searchLocation() {
    const query = $("#search-input").val().trim()
    if (query.trim() === "") {
        alert("Veuillez entrer un lieu")
        return
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            let latlng = [data[0].lat, data[0].lon]
            map.setView(latlng, 15)
            marker.setLatLng(latlng)
            updateLatLng(latlng[0], latlng[1])
        } 
        else {
            alert("Lieu non trouvé")
        }
    })
    .catch(error => console.error("Erreur de géocodage :", error))
}

//ouvrir les maps
function openMaps() {
    let lat = $("#latitude").val()
    let lng = $("#longitude").val()
    if (!lat || !lng) {
        alert("Veuillez sélectionner un emplacement")
        return
    }
    let url = ""
    // Détecter si l'utilisateur est sur iPhone/iPad
    if ((navigator.platform.indexOf("iPhone") !== -1) || 
        (navigator.platform.indexOf("iPad") !== -1) || 
        (navigator.platform.indexOf("iPod") !== -1)) {
        url = `https://maps.apple.com/?daddr=${lat},${lng}`
    } 
    else {
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    }
    window.open(url, "_blank");
}

