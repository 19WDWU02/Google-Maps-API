var map;
var allMarkers = [
    {
        id: 1,
        lat: -41.292662,
    		lng: 174.778967,
    		title:'Tommy Millions',
        description: 'Tommy Millions Pizza and Icecream',
        openingHours: {
            Monday: '11am - 11pm',
            Tuesday: '11am - 11pm'
        }
    },
    {
        id: 2,
        lat: -41.2936945,
		      lng: 174.7731592,
        title: 'Kaffee Eis',
        description: 'Kaffee Eis on Cuba St',
        openingHours: {
            Monday: '7.30am - 11pm',
            Tuesday: '7.30am - 11pm'
        }
    },
    {
        id: 3,
        lat: -41.291377,
		      lng: 174.7922569,
        title: 'Kaffee Eis',
        description: 'Kaffee Eis on Oriental Bay',
        openingHours: {
            Monday: '7.30am - 6pm',
            Tuesday: '7.30am - 6pm'
        }
    },
    {
        id: 4,
        lat: -41.293972,
        lng: 174.782270,
        title: 'Kaffee Eis',
        description: 'Kaffee Eis on Courtenay Place',
        openingHours: {
            Monday: '7.30am - 11pm',
            Tuesday: '7.30am - 11pm'
        }
    },
    {
        id: 5,
        lat: -41.287890,
        lng: 174.779022,
        title: 'Kaffee Eis',
        description: 'Kaffee Eis on Frank Kitt\'s Lagoon',
        openingHours: {
            Monday: '10am - 6pm',
            Tuesday: '10am - 6pm'
        }
    }
];

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -41.286461, lng: 174.776230},
      zoom: 15,
      backgroundColor: '#48dbfb',
      styles: [
          {
              featureType: 'water',
              stylers: [
                    { color: '#48dbfb'}
              ]
          },
          {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [
                  {
                      lightness: '-40'
                    }
              ]
          },
          {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [
                  { color: '#34495e'}
              ]
          },
          {
            featureType: 'road.highway',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
          },
          {
              featureType: 'landscape',
              stylers: [
                 {
                     color: '#2ecc71'
                 }
              ]
          },
          {
              featureType: 'landscape.man_made',
              stylers: [
                  {
                      color: '#27ae60'
                  }
              ]
          },
          {
              featureType: 'transit',
              stylers: [
                  {
                      visibility: 'off'
                  }
              ]
          }
      ]
    });

    for (var i = 0; i < allMarkers.length; i++) {
        var marker = new google.maps.Marker({
            position: {
                lat: allMarkers[i].lat,
                lng: allMarkers[i].lng
            },
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'images/redMarker.png',
            markerTitle: allMarkers[i].title,
            markerID: allMarkers[i].id
        });
        addClickEventToMarker(marker);
    }

    var infobox;
    var firstMarker;
    var secondMarker;
    function addClickEventToMarker(singleMarker){

        if(infobox){
            infobox.close();
        }
        infobox = new google.maps.InfoWindow();
        google.maps.event.addListener(singleMarker, 'click', function(){
            // console.log('position of singleMarker is ' + singleMarker.position);
            infobox.setContent('<div><h3>'+singleMarker.markerTitle+'</h3></div>');
            infobox.open(map, singleMarker);

            for (var i = 0; i < allMarkers.length; i++) {
                if (allMarkers[i].id === singleMarker.markerID) {
                    var markerSingle = allMarkers[i];
                    break;
                }
            }

            $('#details').show();
            $('#details').find('h2').text(markerSingle['title']);
            $('#details').find('p').text(markerSingle['description']);
            $('#mon').text(markerSingle['openingHours']['Monday']);
            $('#tues').text(markerSingle['openingHours']['Tuesday']);

            // singleMarker.setIcon('images/blueMarker.png');

            if(firstMarker){
                // console.log(firstMarker);
                // console.log('first marker has a value');
                if(secondMarker){
                    firstMarker.setIcon('images/redMarker.png');
                    secondMarker.setIcon('images/redMarker.png');
                    secondMarker = null;
                    firstMarker = singleMarker;
                    singleMarker.setIcon('images/blueMarker.png');
                    if(directionsDisplay){
                        directionsDisplay.setMap(null);
                    }
                } else {
                    // console.log('we are now setting second marker');
                    secondMarker = singleMarker;
                    singleMarker.setIcon('images/blueMarker.png');
                    getDirections();
                }
            } else{
                firstMarker = singleMarker;
                singleMarker.setIcon('images/blueMarker.png');
                // console.log('We have now set first Marker');
            }
            // console.log('marker 1 location is ' + firstMarker.position);
            // console.log('marker 2 location is ' + secondMarker.position);

        });
    }
    var directionsDisplay;
    function getDirections(){
        // console.log('show me the directions');
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeOpacity: 0.5,
                strokeColor: 'red',
                strokeWeight: 10
            }
        });

        directionsDisplay.setMap(map);

        directionsService.route({
            origin: firstMarker.position,
            destination: secondMarker.position,
            travelMode: 'DRIVING'
        }, function(response, status){
            if(status == 'OK'){
                // console.log(response.routes[0].legs);
                for (var i = 0; i < response.routes[0].legs.length; i++) {
                    console.log(response.routes[0].legs[i].distance.text);
                    console.log(response.routes[0].legs[i].duration.text);
                }
                directionsDisplay.setDirections(response);


            } else if(status == 'NOT_FOUND'){
                console.log('either your origin or destination is invalid');
            } else if(status == 'ZERO_RESULTS'){
                alert('sorry there is no routes available');
            }
        })
    }

    var input = document.getElementById('location');
    var options = {
      componentRestrictions: {country: 'nz'}
    };
    var autoComplete = new google.maps.places.Autocomplete(input, options);
    autoComplete.addListener('place_changed', function(){
        console.log('the place has been changed');
        var place = autoComplete.getPlace();
        console.log(place);
        map.panTo(place.geometry.location);
        var placeInfo = document.getElementById('placeInfo');
        placeInfo.innerHTML = '<h2>Welcome to '+place.name+'</h2>';
        placeInfo.innerHTML += '<img src="'+place.photos[0].getUrl()+'">';
    });


}

google.maps.event.addDomListener(window, 'load', initMap);
