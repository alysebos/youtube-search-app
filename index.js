const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromAPI(searchTerm, callback) {
	// set the query params that we know
	const query = {
		part: 'snippet',
		key: 'AIzaSyABLCC0f4_Y5XCMWk6YqfBxEoRMrKRPjmI',
		q: `${searchTerm}`,
	}
	// get the JSON for the YouTuvbe search using our query and then run the callback function
	$.getJSON(YT_SEARCH_URL, query, callback);
}

function renderResult(result) {
	// If it's a channel rather than a video, we need to change the display and links
	if (result.id.kind == "youtube#channel") {
		return `
			<li class="result">
				<a href="https://www.youtube.com/channel/${result.id.channelId}">
				<img class="thumbnail" src="${result.snippet.thumbnails.high.url}" alt="Visit the channel: ${result.snippet.title} on YouTube">
				</a>
				<p><a href="https://www.youtube.com/channel/${result.snippet.channelId}">Visit the channel: ${result.snippet.channelTitle}</a></p>
			</li>
		`;
		// if it's a video, let's display it as such
	} else {
		return `
			<li class="result">
				<a href="https://www.youtube.com/watch?v=${result.id.videoId}">
				<img class="thumbnail" src="${result.snippet.thumbnails.medium.url}" alt="Watch the video: ${result.snippet.title} on YouTube">
				</a>
				<p><a href="https://www.youtube.com/channel/${result.snippet.channelId}">More from ${result.snippet.channelTitle}</a></p>
			</li>
		`;
	}
	
}

function displaySearchData(data) {
	// gather total results and results on the page
	const totalResults = data.pageInfo.totalResults;
	const resultsOnPage = data.items.length;
	// insert this data into the appropriate section
	$('.js-search-text').html(`<p>Displaying the first ${resultsOnPage} of ${totalResults} total search results.</p>`);
	// set the results to each item and render them using the above function
	const results = data.items.map((item) => renderResult(item));
	// insert the results into the results list
	$('.js-results-list').html(results);
}

function watchSubmit() {
	// Listen for form submit
	$('.js-search-form').submit(event => {
		// Prevent the form's default
		event.preventDefault();
		// Set the query target to the search box
		const queryTarget = $(event.currentTarget).find('.js-search-box');
		// Set the query value to that search box
		const query = queryTarget.val();
		// Clear the search box
		queryTarget.val("");
		// Run the get data functin using the query and the callback to display it
		getDataFromAPI(query, displaySearchData);
		// Show the results section
		$('.js-search-text').show();
		$('.js-results').show();
	});
}

$(watchSubmit);