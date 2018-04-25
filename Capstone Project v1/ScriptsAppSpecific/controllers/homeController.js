angular.module("app").controller("homeController", ['$scope', 'AppServices', '$rootScope', '$location', '$timeout', '$uibModal', function ($scope, appServices, $rootScope, $location, $timeout, $uibModal) {
    var self = this;
    self.creatingAlert = false;
    self.zoomDistances = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    self.measurements = [
        { type: "Meters", abbreviation: "m" },
        {type: "Kilometers", abbreviation: "km"}
    ];
    self.alert = {};
    var map;
    var AugustaUniversity = { lat: 33.4759, lng: -82.0230 };
    var markers = [];
    self.showButton = false;
    self.showForm = false;
    self.activeSearch = false;

    $timeout($rootScope.authorize, 0).then(function () {
        if (!$rootScope.isAuthorized) {
            console.log("not authorized");
            $location.path("/login");
        }
    });

    function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#007BFF';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '5px';
        controlUI.style.cursor = 'pointer';
        //controlUI.style.marginTop = '22px';
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
    }

    function initMap() {
        var myLatLng = new google.maps.LatLng(33.4759, -82.0230);
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: 33.4759, lng: -82.0230 },
            zoom: 15,
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

        map.setOptions({ minZoom: 2, maxZoom: 20 });

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

        // Add a style-selector control to the map.
        var styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(styleControl);

        // Set the map's style to the initial value of the selector.
        var styleSelector = document.getElementById('style-selector');
        map.setOptions({ styles: styles[styleSelector.value] });

        // Apply new JSON when the user selects a different style.
        styleSelector.addEventListener('change', function () {
            map.setOptions({ styles: styles[styleSelector.value] });
        });

        //creating searchbar with autocomplete from the Google Places Web Services Libraries
        var input = document.getElementById('searchInput');
        var searchBar = new google.maps.places.Autocomplete(input);
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        //making button for searchbar
        var button = document.getElementById('search-button');
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(button);


        // Bias the SearchBox results towards current map's viewport.    
        map.addListener('bounds_changed', function () {
            searchBar.setBounds(map.getBounds());
        });

        button.onclick = function () {
            displaySearchResults(map, searchBar);
        };

    }

    function displaySearchResults(map, searchBar) {
        var place = searchBar.getPlace();

        self.geoPlace = place.formatted_address.split(' ').join('+');    //formatted address to send to geocodes

        if (place.length === 0) {
            return;
        }

        //catch if error on geocode call
        appServices.getGeocode(self.geoPlace).then(function (response) {
            self.place = response.data;   
            self.showButton = true;
        }).catch(function (response) {
            swal("Error", "This is not a real place!", "error");
            return;
            });


        //Clear out the old markers, and circles bound to them
        markers.forEach(function (marker) {
            if (Object.keys(marker).length > 15) {             
                marker.circle.setMap(null);
            }
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

            //changes title of marker when search based on that is in the title input field
            titleValid = /\S/;
            if (titleValid.test(self.alert.title)) {
                var placeTitle = self.alert.title;
            }
            else {
                var placeTitle = place.name;
            }

            // Create a marker for each place.
            self.marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: placeTitle,
                position: place.geometry.location
            });

            markers.push(self.marker);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        }
        map.fitBounds(bounds);
    }

    self.draw = function () {   //also make sure a location is searched!!!!!!!
        if (self.alert.measureType !== 'm' && self.alert.measureType !== 'km') {
            swal("WARNING", "You must select a measurement type", "warning");
            return;
        }
        else if (!self.place) {
            swal("WARNING", "You must search for a location first.", "warning");           
            return;
        }
        else if (isNaN(parseFloat(self.alert.radius))) {
            swal("WARNING", "Radius can only be numbers", "warning");
            return;
        }
        if (parseFloat(self.alert.radius) <= 0) {
            swal("WARNING", "Radius can only be positive numbers.", "warning");
            return;
        };
        drawCircle(map, self.place.results[0].geometry.location.lat, self.place.results[0].geometry.location.lng, self.alert.radius);
    };
    //draws a circle on the map with radius of input on form. If there is already a circle, 
    //it checks to see what the new radius is, removes old, changes radius, and redraws a new one ont he same marker
    function drawCircle(map, lat, lng) {
        if (Object.keys(self.marker).length > 14) {
            self.marker.circle.setMap(null);
            if (self.alert.measureType === 'm') {
                self.marker.circle.radius = parseFloat(self.alert.radius);
            }
            else if (self.alert.measureType === 'km') {
                self.marker.circle.radius = (parseFloat(self.alert.radius) * 1000);
            }         
            self.marker.circle.setMap(map); 
            return;
        }

        self.alert.lat = lat;
        self.alert.lng = lng;

        //checking if measuring in kilometers or meters then adjusting radius of circle
        if (self.alert.measureType === 'm') {
            var radiusDistance = parseFloat(self.alert.radius);
        }
        else if (self.alert.measureType === 'km') {
            var radiusDistance = parseFloat(self.alert.radius) * 1000;
        }

        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            radius: radiusDistance,
            draggable: false
        });

        circle.bindTo('center', self.marker, 'position');  //makes circle property of self.marker (marker created on searching of an address);
        self.marker.circle = circle;
        self.marker.setMap(map); 
    };

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
    };


    self.submit = function () {
        var modal = $uibModal.open({
            template: '<img src="Content/images/Loading.gif" />',
            windowClass: 'show loading-modal modal-dialog',
            backdropClass: 'show',
            
        });
        console.log(modal);
        self.creatingAlert = true;
        if (!self.marker.circle) {
            swal("WARNING", "You must draw a circle to specify the danger zone", "warning");
            self.creatingAlert = false;
            return;
        }
        self.alert.zoom = map.getZoom();
        var alert = {
            location_lat: self.alert.lat,
            location_lng: self.alert.lng,
            Description: self.alert.description,
            Title: self.alert.title,
            Radius: (self.alert.measureType === "km" ? self.alert.radius * 1000 : self.alert.radius),  
            MeasurementType: self.alert.measureType,
            Zoom: self.alert.zoom
        };
        appServices.addAlert(alert).then(function (response) {
            var count = response.data;
            modal.close('');
            modal.closed.then(function (data) {
                var message = count === 1 ? " contact was notified." : " contacts were notified.";
                swal("SUCCESS", "An alert was created successfully!\n" + count + message, "success");
            });
            self.activeSearch = false;
            //clears form data         
            self.alert = {};
            self.marker.setMap(null);
            self.marker.circle.setMap(null);
            self.marker = null;
            self.searchBar = "";
            map.setCenter(AugustaUniversity);
            self.showButton = false;
            self.showForm = false;
            self.place = null;
        }).catch(function (response) {
            modal.close('');
            modal.closed.then(function (data) {
                swal("ERROR", "Something went wrong with creating the alert.", "error");
            });
            self.creatingAlert = false;
            return;
            });
        self.creatingAlert = false;
     
    };

    self.cancel = function () {
        self.place = null;
        self.alert = {};
        if (self.marker) {
            self.marker.setMap(null);
            if (Object.keys(self.marker).length > 15) {        
                self.marker.circle.setMap(null);
            }            
        }   
        self.marker = null;
        self.searchBar = "";
        map.setCenter(AugustaUniversity);
        swal("Successful Cancel", "Your alert was canceled successfully.", "success");
        self.activeSearch = false;
    };

    self.buttonShow = function () {
        self.showButton = !self.showButton;
        self.activeSearch = true;
    };

    self.formShow = function () {
        self.showForm = !self.showForm;
    };



    initMap();
}]);