"use strict";
//ticketmaster API url and API key
const tmApiKey = "p48FaIihgbRfceXm48vMgx9sScj9hrus";
const tmURL = "https://app.ticketmaster.com/discovery/v2/events.json";

//listens for submit button click event
function watchInput() {
  $(".startForm").submit(event => {
    event.preventDefault();
    const searchTerm = $(".search-text").val();
    if (searchTerm) {
      getConcerts(searchTerm);
      window.location.href = "results.html"
    } else {
      $(".error-message").text("Please Input City");
    }
  });
}
function watchNavBar() {
  $('.bar').submit(event => {
    event.preventDefault();
    const searchTerm = $('.search-text').val();
    if (searchTerm) {
      getConcerts(searchTerm);
      location.reload();
    } else {
      $(".error-message").text("Please Input City");
    }
  })
}

function getConcerts(city) {
  let params = {
    city: city,
    apikey: tmApiKey,
    countryCode: "US",
    classificationName: "music",
    sort: 'date,asc'
  };
  const queryString = formatQueryParams(params);
  const url = tmURL + "?" + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      localStorage.setItem("concerts", JSON.stringify(responseJson));
    })
    .catch(err => {
      console.log(err);
    });
}

//takes query parameters and returns them in a form that can be used by fetch
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

$(function() {
  watchInput();
  watchNavBar();
})
