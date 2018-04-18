var totalEvents = 0;
var totalweekEvents = 0;
var eventText = "";

/*
 * Assigns the listener to the input field for the enter key
 * When the listener fires, the result container is cleared, the spinner
 * is activated and the Eventbrite API is called
*/
function assign() {
	$('body').on('keypress', '#para', function(e) {
		if (e.which == 13) {
			var inputPara = $("#para").val();
			// alert("Enter was pressed");
			// Call the api with location
			$('.result-container').html("");
			callAPI(inputPara);

			$("#searchspinner").addClass("is-active");
		}
	});
}

/*
 * Calls the Eventbrite API twice, first for weekedn events in the specified location
 * Second  with the popular events at the location.
*/
function callAPI(inputPara) {
	var url = 'http://127.0.0.1:5000/';
	
	// Clearing the eventText variable
	questionText = "";

	// Request Lua server to get questions
	makeAJAXCall(url, inputPara);
}

/*
 * Makes the AJAX call, handles the spinner actions and calls the write function
*/
function makeAJAXCall(url, inputPara) {
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		crossDomain: true,
		data: { 'sentence': inputPara },
		success: function(result, status, xhr) {
			/*
			 * After the AJAX Request, we remove the spinner
			*/
			$("#searchspinner").removeClass("is-active");

			writeEvents(result);
			
		},
		error: function(xhr, status, error) {
			alert(error);
			if (status == "timeout")
				$(".result-container").html("<div class='heading'>The request has timed out, please try again</div>");
		},
	});
}

/*
 * Writes the recieved events into the popup and saves them into the localStorage
*/
function writeEvents(result) {
	console.log(result)
	res = result
	console.log(res)
	questionText += '<div class="questions"><div class="heading">Questions</div>';
	
	var i = 0;
	while (i < res["num"]) {
		questionText += '<span class="que"><li>' + res["question"] + '</li></span><br>';
		i += 1;
	}

	questionText += '</div>';
	
	// Writing to the popup page
	$(".result-container").html(questionText);
	// Writing to the localStorage under the 'results' key.
	localStorage.results = $('.result-container').html();
}


window.onload = function() {
	// The previous search results are fetched from local storage and populated
	if (localStorage.results != undefined) {
		$('.result-container').html('<div class="prev">Previous Question</div><br>' + localStorage.results);
	}

	assign();
};
