var ViewModel = function() {

  var self = this;

  var locations = [
    {title: 'Porterhouse Bar and Grill', location: {lat: 25.933382, lng: -80.12204}, id: '0', url: "https://api.foursquare.com/v2/venues/4c44fa2974ffc928696376cc/photos?client_id=BPSFN1PV2XO5ETAN1EM5AKHNZOHNRYII3E2WJZVQGZBZ2V1Y&client_secret=KSPJGR42JXKTSPN4PXE2VCWPTNRHA1MZFFHF54UU3XDC2BBA&v=20171025", address: '17004 Collins Ave, Sunny Isles Beach, FL 33160', phone: '(305) 949-7757'},
    {title: 'Beach Bar at Newport Pier', location: {lat: 25.9300782, lng: -80.122728}, id: '1', url: "https://api.foursquare.com/v2/venues/537e91da498e08214a8f989e/photos?client_id=BPSFN1PV2XO5ETAN1EM5AKHNZOHNRYII3E2WJZVQGZBZ2V1Y&client_secret=KSPJGR42JXKTSPN4PXE2VCWPTNRHA1MZFFHF54UU3XDC2BBA&v=20171025", address: '16501 Collins Ave, Sunny Isles Beach, FL 33160', phone: '(305) 957-1110'},
    {title: 'Sumo Sushi Bar and Grill', location: {lat: 25.9395428, lng: -80.1239967}, id: '2', url: "https://api.foursquare.com/v2/venues/4bc9227a937ca593d95ea592/photos?client_id=BPSFN1PV2XO5ETAN1EM5AKHNZOHNRYII3E2WJZVQGZBZ2V1Y&client_secret=KSPJGR42JXKTSPN4PXE2VCWPTNRHA1MZFFHF54UU3XDC2BBA&v=20171025", address: '17630 Collins Ave, Sunny Isles Beach, FL 33160', phone: '(305) 682-1243'},
    {title: "Duffy's Sports Grill", location: {lat: 25.9308178, lng: -80.1336137}, id: '3', url: "https://api.foursquare.com/v2/venues/4e0089ca7d8beaa1649ca6c7/photos?client_id=BPSFN1PV2XO5ETAN1EM5AKHNZOHNRYII3E2WJZVQGZBZ2V1Y&client_secret=KSPJGR42JXKTSPN4PXE2VCWPTNRHA1MZFFHF54UU3XDC2BBA&v=20171025", address: '3969 NE 163rd St, North Miami Beach, FL 33160', phone: '(305) 760-2124'},
    {title: 'Azzurro Italian Restaurant & Bar', location: {lat: 25.9424018, lng: -80.1231467}, id: '4', url: "https://api.foursquare.com/v2/venues/4bae7e2df964a52017b93be3/photos?client_id=BPSFN1PV2XO5ETAN1EM5AKHNZOHNRYII3E2WJZVQGZBZ2V1Y&client_secret=KSPJGR42JXKTSPN4PXE2VCWPTNRHA1MZFFHF54UU3XDC2BBA&v=20171025", address: '17901 Collins Ave, Sunny Isles Beach, FL 33160', phone: '(305) 931-7000 '}
  ];

  this.locationList = ko.observable(locations);

  this.locationList().forEach(function(location) {
    location.visible = ko.observable(true);
  });

  this.hide = ko.observable(true);

  this.toogleMenu = function() {
    self.hide(!self.hide());
  };
  var markers = [];
  var largeInfowindow = new google.maps.InfoWindow();

  locations.forEach(function(location) {

    var marker = new google.maps.Marker({
      position: location.location,
      map: map,
      title: location.title,
      animation: google.maps.Animation.DROP,
      id: location.id
    });

    markers.push(marker);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow, locations);
      toggleBounce(this);
    });

  });

  function toggleBounce(marker) {
    
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 750);
    
  }

  self.openInfoWindow = function(location) {
      new google.maps.event.trigger(markers[location.id], 'click' );
      toggleBounce(markers[location.id]);
  };

  function populateInfoWindow(marker, infowindow, locations) {

    var url = locations[marker.id].url;
    $.ajax(
      {
        url: url,
        success: function(data) {
          var imgSrc = [];
          for (var i = 0; i < 4; i++) {
            var prefix = data.response.photos.items[i].prefix;
            var suffix = data.response.photos.items[i].suffix;
            imgSrc[i] = prefix + "100x100" + suffix;
            
          }
          if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + locations[marker.id].address + '</div>' + '<div>' + locations[marker.id].phone + '</div>' + '<img src="' + imgSrc[0] + '">' + '<img src="' + imgSrc[1] + '">' + '<img src="' + imgSrc[2] + '">' + '<img src="' + imgSrc[3] + '">');
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function(){
              infowindow.setMarker = null;
            });
          }
          
          
        },
        error: function() {
          alert( "Sorry. Images could not be loaded." );
        }
      }
    );
    
  }


  self.userInput = ko.observable('');

  self.filterMarkers = function () {
    var searchInput = self.userInput().toLowerCase();
    self.locationList().forEach(function (place) {
      markers[place.id].setVisible(false);
      place.visible(false);
      if (place.title.toLowerCase().indexOf(searchInput) !== -1) {
        markers[place.id].setVisible(true);
        place.visible(true);
      }
    });
  };

};

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.9429, lng: -80.1234},
    zoom: 14
  });




ko.applyBindings(new ViewModel());

}

function googleError() {
  alert( "Sorry. Map could not be loaded." );
}

