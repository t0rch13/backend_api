function initMap() {
    var coordinates = { lat: 37.7749, lng: -122.4194 }; // Replace with your desired coordinates
    var map = new google.maps.Map(document.getElementById('map'), {
        center: coordinates,
        zoom: 12
    });

    var marker = new google.maps.Marker({
        position: coordinates,
        map: map,
        title: 'Your Marker Title'
    });
}