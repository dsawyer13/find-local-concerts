'use strict';

const tmApiKey = 'p48FaIihgbRfceXm48vMgx9sScj9hrus';
const tmURL = "https://app.ticketmaster.com/discovery/v2/events.json";

var rapid = new RapidAPI("find-local-shows_5bf6080de4b08725af2b0d57", "b306b59c-5cb9-4d9f-9df6-e268b26cc3a6");


function watchInput() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    $('.appendNav').html(
      `<main role="main">
      <nav role="navigation">
        <h1 class="navh1">🎵 Find Local Shows</h1>
        <form class="bar">
          <fieldset name="search-bar">
            <label for="search-term">
              <input class="search-text" type="text" name="search-term" id="js-search-term" placeholder="Search by Location...">
            </label>
            <input class="search-button" type="submit" value="Go!">
          </fieldset>
          </form>
      </nav>`
    )
    getConcerts(searchTerm);

  })
};

function getConcerts(searchTerm) {
  const params = {
    city: searchTerm,
    apikey: tmApiKey,
    //radius: '50',
    //unit: 'miles',
    countryCode: 'US',
    classificationName: 'music'
  };
  const queryString = formatQueryParams(params);
  const url = tmURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();

      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayConcertResults(responseJson))
    .catch(err => {
      alert("Invalid Search. Please try again.");
    })
};






function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
};

function displayConcertResults(responseJson) {
  console.log(responseJson);
  $('#js-error-message').empty();
  $('#results-list').empty();
   for (let i = 0; i < 10; i++) {
     var date = new Date(responseJson._embedded.events[i].dates.start.localDate);
     const fixDate = ((date.getMonth()+1)+ '/' + date.getDate() + '/' + date.getFullYear());

    let artistName = `${responseJson._embedded.events[i]._embedded.attractions[0].name}`;

    console.log(artistName);

     $('#results-list').append(
       `<ul>
          <li class="concertPic"><img src="${responseJson._embedded.events[i].images[4].url}" width="225px" height="150px" class="show-image" alt="${responseJson._embedded.events[i].name}"></li>
          <div class="textBlock">
            <li class="date">${fixDate}</li>
            <li class="title"><h4>${responseJson._embedded.events[i].name}</h4></li>
            <li class="concertLocation">@ ${responseJson._embedded.events[i]._embedded.venues[0].name}</li>

            <li><div class='audioPlayer'></div></li>
          </div>
          <div class="buttons">
            <button class="getAudioButton" artistName='${artistName}' item-index="${i}">Play Music</button>
            <button class="tickets" onclick="window.location.href='${responseJson._embedded.events[i].url}'">Buy Tickets</button>
          </div>
        </ul>
       `

     )

   };
  getAudioPlayer();
}



function getAudioPlayer() {
  $('#results-list').on('click', '.getAudioButton', event => {

    const itemIndex = event.target.getAttribute('item-index');
    const artist = event.target.getAttribute('artistName');

    rapid.call('iTunes', 'search', {
      'term': artist,
      'country': 'US',
      'limit': '1'
    }).on('success', function (payload) {

      $('.audioPlayer').eq(itemIndex).html(`<audio controls><source src='${payload.results[0].previewUrl}' type="audio/mpeg" </audio>`);
    }).on('error', function (payload) {
    alert("An error has occured. Please try again.");
    });

  }
  )
}


$(watchInput);
