$(document).ready(function() {

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// if login
		}
		else{
			window.location.href='index.html';
		}
	});

	//DEFAULT
	$("#title_page").text("Dashboard");
	$("#title_small_page").text("Dashboard");
	$("#title_page_breadcrumb").text("Dashboard");

	//count category 
	var count_category = 0;
	var db = firebase.database().ref().child('category');
	db.on('value', function(data) {
	  	count_category = count_category + 1;
	});

	//count recipes 
	var count_recipes = 0;
	var db = firebase.database().ref().child('recipes');
	db.on('value', function(data) {
	  	count_recipes = count_recipes + 1;
	});

	setTimeout(function(){
		alert(count_category);
		alert(count_recipes);
		
		$('#count_category>h3').html(count_category);
		$('#count_recipes>h3').html(count_recipes);

	    $('body').addClass('loaded'); 
	}, 2000); //hide loader after 3000 ms (3s)
});