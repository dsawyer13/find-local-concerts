'use strict';

const tmApiKey = 'p48FaIihgbRfceXm48vMgx9sScj9hrus';
const tmURL = "https://app.ticketmaster.com/discovery/v2/events.json";

var rapid = new RapidAPI("find-local-shows_5bf6080de4b08725af2b0d57", "b306b59c-5cb9-4d9f-9df6-e268b26cc3a6");


function watchInput() {
  $('.startForm').submit(event => {
    event.preventDefault();
    const searchTerm = $('.search-text').val();
    const startVisible = $('.startPage').css('display');
    if (startVisible !== 'none') {
    $('.startPage').css('display', 'none');
    $('.appendNav').css('display', 'block');
    getConcerts(searchTerm);
  $('.startForm').reset();}

    else {
      watchNavBar();
    }
  })
};

function watchNavBar() {
  $('.bar').submit(event => {
    event.preventDefault();
    const searchTerm2 = $('.nav-search-text').val();
    getConcerts(searchTerm2);
    $('.bar').reset();
  })
}

function watchHomeButton() {
  $('.navh1').on('click', event => {
    $('.appendNav').css('display', 'none');
    $('.startPage').css('display', 'block')
    $('#results-list').empty();
  }
)
}

function getConcerts(searchTerm) {
  let params = {
    city: searchTerm,
    apikey: tmApiKey,
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
       `<li class="eachResult">
          <img class="concertPic" src="${responseJson._embedded.events[i].images[4].url}" width="225px" height="160px" class="show-image" alt="${responseJson._embedded.events[i].name}">

            <div class="textBlock">
              <div class="date">${fixDate}</div>
              <div class="title"><h4>${responseJson._embedded.events[i].name}</h4></div>
              <div class="concertLocation">@ ${responseJson._embedded.events[i]._embedded.venues[0].name}</div>
            </div>
            <div class="button">
              <button class="getAudioButton" artistName='${artistName}' item-index="${i}">Play Music</button>
              <button class="tickets" onClick="window.open('${responseJson._embedded.events[i].url}')">Buy Tickets</button>
              <div class='audioPlayer'></div>
            </div>

        </li>
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
function runScripts() {
  $(watchHomeButton);
  $(watchNavBar);
  $(watchInput);
};

runScripts();
