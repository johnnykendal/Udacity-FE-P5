//Hard coded night club locations
var nightClubData = [
	{ name: "BNA Brew Co. & Eatery",
        address: "1250 Ellis",
        city: "Kelowna BC, V1Y1Z4",
        description: "Exciting addition to ylw's cultural district! We can't wait to share with you our passion & love for craft beer, delicious food, & warm hospitality",
        latlng: { lat: 49.8927854, lng: -119.4939733 },
        website: "http://bnabrewing.com",
        phone: "(236)-420-0025",
        query: "BNA Brewing",
        fourSqUrl: "https://foursquare.com/v/bna-brew-co--eatery/547f4ac9498e6fbd3fa0e834"
    },
	{ name: "Rose's Waterfront Pub",
        address: "1352 Water St",
        city: "Kelowna BC, V1Y9P4",
        description: "Rose’s Waterfront Pub offers a wide variety of delicious food choices as well as an extensive gluten friendly menu . From standard pub fare to gourmet entrees. Combined with daily specials and great services, you are not only sure to find something to fill your appetite, but have a good time doing so!",
        latlng: { lat: 49.890466, lng:-119.497669 },
        website: "http://rosespub.com/",
        phone: "(250)-860-1141",
        query: "Rose's",
        fourSqUrl: "https://foursquare.com/v/roses-waterfront-pub/4b47bd08f964a5209f3c26e3"
    },
	{ name: "Sapphire Night Club",
        address: "238 Leon Ave",
        city: "Kelowna BC, V1Y 6H9",
        description: "From bringing you the hottest DJ’s and artists, tantalizing drinks, and the sexiest clubbers the world can offer, Sapphire is your destination to party. From dancing to drinking, college students to VIPs, Sapphire’s got you covered.",
        latlng: { lat: 49.884693, lng: -119.498143},
        website: "http://sapphirekelowna.com/",
        phone: "(250) 860-0800",
        query: "Sapphire",
        fourSqUrl: "https://foursquare.com/v/sapphire-night-club/4d3fcf3734f42d43d3f54285"
    },
	{ name: "Level Night Club",
        address: "275 Leon Avenue ",
        city: "Kelowna BC, V1Y6J1",
        description: "Level is your Okanagan Summer Headquarters for long weekends and everything in between",
        latlng: { lat: 49.884391, lng: -119.497230},
        website: "http://levelclub.ca",
        phone: "(250)-317-3328",
        query: "Level",
        fourSqUrl: "https://foursquare.com/v/level-niteclub/4f40a924e4b062d5cbe6205e"
    },
	{ name: "Kelly O'Bryan's",
        address: "262 Bernard Avenue",
        city: "Kelowna BC, V1Y 6N4",
        description: "Our Kelowna location features both a Kelly O'Bryan's Neighborhood Restaurant and a Carlos O'Bryan's pub. Easy access and located near the waterfront in downtown Kelowna, Kelly O'Bryans is a fun place to eat especially for the younger set. Delicious food at reasonable prices, we are a fun place for all ages. We pride ourselves on our excellent service, ensuring that our staff is attentive and helpful.",
        latlng: { lat: 49.886563, lng: -119.497725},
        website: "http://kobcob.com/index.php",
        phone: "(250)-861-1338",
        query: "KellyO'Bryan's",
        fourSqUrl: "https://foursquare.com/v/kelly-obryans/4b68fb9af964a520dc952be3"
    }
];

//Declare map variable and marker info
var map;
var infoWindow;
var marker;

//String of content to put in the infoWindow
var infoContent = "";

//NightClub object, to hold all data for each one
function NightClub(appData) {
	this.address = ko.observableArray(appData.address);
	this.description = ko.observable(appData.description);
    this.latlng = ko.observable(appData.latlng);
	this.name = ko.observable(appData.name);
	this.city = ko.observable(appData.city);
}
	
//initilize google map and properties
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
		center:  new google.maps.LatLng(49.8867524, -119.498486),
       	zoom: 15,
       	mapTypeId: google.maps.MapTypeId.ROADMAP
    });
      
	ko.applyBindings(ViewModel());
}

//ViewModel
function ViewModel() {
	var self = this;
	self.markers = [];
	
	//Create array to hold initail locations 
	self.nightClubLocations = ko.observableArray(nightClubData);
	
	//Create marker for each location
	self.nightClubLocations().forEach(function(locationData) {
       	marker = new google.maps.Marker({
       		position: locationData.latlng,
        	map: map,
        	title: locationData.name,
        	animation: google.maps.Animation.DROP
    	});
		
		//Bind location markers to marker
		locationData.marker = marker;
	
		//Click listener for each marker to load data and animate the marker to bounce 
		marker.addListener("click", function() {
			self.showInfo(locationData);
		});
	});
	
	//Goes to corresponding map marker from the location that was clicked in the list
	self.listClick = function(clubData) {
			self.showInfo(clubData);
	};	
	
	//Triggers foursquare api and ajax call, animating the google map marker when clicked and populating the infoWindow  
	self.showInfo = function (locationData) {
    // we want this function to take care of opening info windows
		getFourSquareData(locationData);
			if (locationData.name) {
				locationData.marker.setAnimation(google.maps.Animation.BOUNCE);
				map.setCenter(marker.getPosition());
				map.panTo(marker.position);
			} setTimeout(function() {
				locationData.marker.setAnimation(null);
			}, 3000);
	};
	
	//Bind infoWindow to google maps infoWindow
	infoWindow = new google.maps.InfoWindow({maxWidth: 300});
	
	//FourSquare api request
	function getFourSquareData(locationData) {
		var clientId = "5C3LCKHKS5UCGPP5PFZDI3UOSXDDU0IKZGQHRQLVR21C0EFG";
		var clientSecret = "KBGC4WR3PSR3CAU3X5COKY3G45OKQRIPJ1PTNVH4452LWXOT";
		var fourSqV = "20140806";
		var llLat;
        var llLng;
		var errorMsg;
		var fourSqUrl;
		var club;

		llLat = locationData.latlng.lat;
        llLng = locationData.latlng.lng;
		//Build FourSquare url string for each location
		fourSqUrl = "https://api.foursquare.com/v2/venues/explore" + "?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=" + fourSqV + '&ll=' + llLat + ',' + llLng + "&query=" + locationData.query +"&intent=checkin&radius=1000" + "&limit=10";
		
		//Send ajax request to FourSquare api
		$.ajax({
			url: fourSqUrl,
			jsonp:"callback",
			dataType: "jsonp",
			success: function(data) {
				console.log("ajax success");
				club = data.response.groups[0].items[0].venue;
				var frSqName = club.name,
					frSqFormattedAddress = club.location.formattedAddress,
					
						
						
				//Create content string for infoWindow	
				infoContent = "<div id='infoWindow'>" + 
					"<h2>" + frSqName + "</h2>" +
					"<p>" + frSqFormattedAddress + "</p>" +
					"<p>" + locationData.description + "</p>" +
					"<a href='" + locationData.website + "' target=_blank>" + locationData.website + "</a>" +
					"<p>" + locationData.phone + "</p>" + 
					"<p>" + 'Information provided by Foursquare' + "</p></div>";
				
				
				//Set and open infoWindow
				infoWindow.setContent(infoContent);
			    infoWindow.open(map, locationData.marker);
			}, 
			// Display error after 3 seconds if Request to API fails
			error: function(fourSqUrl, errorMsg) {
                setTimeout(function() {
                    if (errorMsg) {
                        infoWindow.setContent("Could not retrive data from the server, sorry");
                        infoWindow.open(map, locationData.marker);
                    }
                }, 3000);
			}
		});
	}

	//Click event on map to close out of any info windows and searches.
	map.addListener("click", function(event) {
        infoWindow.close(); 
        infoWindow.setContent(null); 
        self.query("");
    });
	
	//Search query
	self.query = ko.observable("");
	
    //Bind to search id
    var search = $("#search");
    
    //When enter is pressed, if names match preform actions in function
    search.change(function() {
    	nightClubData.forEach(function(club) {
    		if (club.name.toLowerCase() === search.val().toLowerCase()) {
        		self.showInfo(club);
            } 
        }); 
    });
	
	//Filter search results through the observable array created to hold the locations, nightClubLocations()
    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.nightClubLocations(), function(listResult) {
            //Match the items that have been searched with any items in nightClubLocations()
            var match = listResult.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
			//If true show corresponding markers
            if (match) { 
                listResult.marker.setVisible(true);
            }
			//If false hide corresponding markers
			else {
                listResult.marker.setVisible(false);
            }
            return match;
           
        });
       
    });

	google.maps.event.addDomListener(window, "load", function() {
		map.setCenter(new google.maps.LatLng(49.8867524, -119.498486));
	});
}

//Error handler if google maps api cannot load
function googleError() {
    alert("Google maps api could not be loaded, please try again");
}
