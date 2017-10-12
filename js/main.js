// var mylocation = {lat: 43.3209022, lng: 21.8957589};

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
  //  x.innerHTML = "Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude;
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
        +latlon+"&zoom=14&size=400x300&key=AIzaSyDXiXRsi6lP_otZ6KFp2zNW0if67kcb4Kg";
    document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}

var map;
var infowindow;

function initMap() {
    getLocation();
    var pyrmont = {lat: 43.3209022, lng: 21.8957589};

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 0
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 500,
        type: ['atm']
    }, callback);

    source = '43.3209022,21.8957589';
    destination = '43.3209455,21.8957589';
    var serviceMatrix = new google.maps.DistanceMatrixService();
    serviceMatrix.getDistanceMatrix({
        origins: [source],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;
            var dvDistance = document.getElementById("dvDistance");
            dvDistance.innerHTML = "";
            dvDistance.innerHTML += "Distance: " + distance + "<br />";
            dvDistance.innerHTML += "Duration:" + duration;

        } else {
            alert("Unable to find the distance via road.");
        }
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var ul = document.createElement('ul');
        document.body.append(ul);
        for (var i = 0; i < 10; i++) {
            createMarker(results[i]);
            console.log(results[i]);
            console.log(results[i].vicinity);
            var li = document.createElement('li');
            li.innerHTML = results[i].name+' '+results[i].vicinity+' '+'<div id="dvDistance"></div>';
            ul.append(li);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}