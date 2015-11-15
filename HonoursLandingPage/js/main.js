var map;
var activeUsersCount;
var totalUsersCount;
var postsCount;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 55.9531, lng: 3.1889},
		zoom: 3
	});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		var pos = {
  			lat: position.coords.latitude,
  			lng: position.coords.longitude
  		};
  		map.setCenter(pos);
  	}, function() {
  		handleLocationError(true, map.getCenter());
  	});
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
}
}

function handleLocationError(browserHasGeolocation, pos) {
	console.log("GPS not supported.")
}

function initialise() {
	Parse.initialize("nFHu3bnj37q5vzWkItvJutUFOPMLwjC1HbiiAXiC", "aglDt84BS2aquYjLb2E14AHumLw9BvlDm4uAQ59f");

	// Get posts
	var Posts = Parse.Object.extend("PhotoTest");
	var query = new Parse.Query(Posts);
	query.find( {
		success: function(posts) {
			generateStats(posts);
			populateMap(posts);
		},
		error: function(object, error) {
			alert("Could not retrieve posts from parse.");
		}
	});
}

function generateStats(posts){
	postsCount = posts.length;
	$('#postStats').text(postsCount);

	var users = [];
	for(var i in posts){
		users.push(posts[i].get("user"));
	}
  
	var a = unique(users);
	activeUsersCount = a.length;

	$('#activeUsersCount').text(activeUsersCount);

   	//get user count
   	var users = Parse.Object.extend("User");
   	var query = new Parse.Query(users);
   	query.find( {
   		success: function(users) {
   			totalUsersCount = users.length;
   			$('#totalUsersCount').text(totalUsersCount);
   		},
   		error: function(object, error) {
   			alert("Could not retrieve poerssts from parse.");
   		}
   	});

   }

   function unique(array){
   	return array.filter(function(el, index, arr) {
   		return index === arr.indexOf(el);
   	});
   }
   function populateMap(posts) {
   	for (var i in posts){
   		var user = posts[i].get("user");
   		var platform = posts[i].get("platform");
   		var location = {lat: posts[i].get("lat"), lng: posts[i].get("lon")}
   		var image = posts[i].get("image").url();
   		var date = posts[i].get("createdAt");

   		buildMarker(user, platform, location, image, date);
   	}
   }

   function buildMarker(user,platform, location, image, date){
   	var infowindow = new google.maps.InfoWindow({
   		content: "<img class='mapImage' src='"+image+"'></img> <p>" + user + ", " + platform + "</p> <p>" +date.toString().split("GMT")[0]+ "</p>",
   		maxWidth: 200

   	});

   	var marker = new google.maps.Marker({
   		position: location,
   		map: map,
   		title: user + ", " + platform
   	});

   	if(platform == "Android"){
   		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
   	} else {
   		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
   	}

   	marker.addListener('click', function() {
   		infowindow.open(map, marker);
   	});
   }

   $('#down').on('click', function(e){
   	e.preventDefault();
   	var target= $('#map');
   	$('html, body').stop().animate({
   		scrollTop: target.offset().top
   	}, 1000);
   });