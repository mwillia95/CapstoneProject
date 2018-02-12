angular.module("app").controller("homeController", ['$scope', 'AppServices', function ($scope, appServices) {
    var self = this;

    var map;
    var AugustaUniversity = { lat: 33.4759, lng: -82.0230 };
    var markers = [];

    function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#007BFF';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '5px';       
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginTop = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'white';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Center Map';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {
            map.setCenter(AugustaUniversity);
        });
    };

    function initMap() {
        var myLatLng = new google.maps.LatLng(33.4759, -82.0230);
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: 33.4759, lng: -82.0230 },
            zoom: 12,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid'],
                position: google.maps.ControlPosition.TOP_LEFT
            }
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: "Augusta University"
        });
        marker.setMap(map);

       


        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

        // Add a style-selector control to the map.
        var styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(styleControl);

        // Set the map's style to the initial value of the selector.
        var styleSelector = document.getElementById('style-selector');
        map.setOptions({styles: styles[styleSelector.value]});

        // Apply new JSON when the user selects a different style.
        styleSelector.addEventListener('change', function () {
            map.setOptions({ styles: styles[styleSelector.value] });
        });

        //creating searchbar with autocomplete from the Google Places Web Services Libraries
        var input = document.getElementById('searchInput');
        var searchBar = new google.maps.places.Autocomplete(input);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        //making button for searchbar
        var button = document.getElementById('search-button');
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(button);
      
        
        // Bias the SearchBox results towards current map's viewport.    
        map.addListener('bounds_changed', function () {
            searchBar.setBounds(map.getBounds());        
        });

        button.onclick = function () {
            displaySearchResults(map, searchBar);
        }
    };

    function displaySearchResults(map, searchBar) {      
        var place = searchBar.getPlace();
        
        if (place.length === 0) {
            return;
        }

         //Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
            marker = null;         
        });
        
        markers = [];
    

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        createMarkers(place);
        function createMarkers(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);
            console.log("after push");
            console.log(markers);
            console.log(markers.length);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        };
        map.fitBounds(bounds);
    }

    var styles = {
        default: null,
        night: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
          },
          {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
          },
          {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }]
          },
          {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }]
          },
          {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }]
          },
          {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }]
          },
          {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }]
          },
          {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }]
          },
          {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }]
          },
          {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }]
          },
          {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }]
          },
          {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
          },
          {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }]
          },
          {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }]
          },
          {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }]
          }
        ],
        candy: [
         { elementType: 'geometry', stylers: [{ color: '#ade88b' }] },  //soft green
         { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
         { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
         {
             featureType: 'administrative.locality',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#d59563' }]
         },
         {
             featureType: 'poi',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#d59563' }]
         },
         {
             featureType: 'poi.park',
             elementType: 'geometry',
             stylers: [{ color: '#263c3f' }]
         },
         {
             featureType: 'poi.park',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#6b9a76' }]
         },
         {
             featureType: 'road',
             elementType: 'geometry',
             stylers: [{ color: '#9a2daf' }]   //purple
         },
         {
             featureType: 'road',
             elementType: 'geometry.stroke',
             stylers: [{ color: '#f2aeb4' }]  //pink
         },
         {
             featureType: 'road',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#9ca5b3' }]
         },
         {
             featureType: 'road.highway',
             elementType: 'geometry',
             stylers: [{ color: '#ea3545' }]  //salmon
         },
         {
             featureType: 'road.highway',
             elementType: 'geometry.stroke',
             stylers: [{ color: '#6dcde8' }]   //baby blue
         },
         {
             featureType: 'road.highway',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#f3d19c' }]
         },
         {
             featureType: 'transit',
             elementType: 'geometry',
             stylers: [{ color: '#2f3948' }]
         },
         {
             featureType: 'transit.station',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#d59563' }]
         },
         {
             featureType: 'water',
             elementType: 'geometry',
             stylers: [{ color: '#efac40' }]  //soft yellow
         },
         {
             featureType: 'water',
             elementType: 'labels.text.fill',
             stylers: [{ color: '#515c6d' }]
         },
         {
             featureType: 'water',
             elementType: 'labels.text.stroke',
             stylers: [{ color: '#17263c' }]
         }
        ],
    };

    initMap();
}]);