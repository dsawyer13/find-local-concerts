"use strict";
// const concertsRaw = localStorage.getItem("concerts");
const concerts = JSON.parse(window.data.concerts);
console.log(concerts)

$(document).ready(displayConcertResults(concerts));

function goHome() {
  $(".navh1").click(e => {
    window.location.href = "index.html";
  });
}
function displayConcertResults(concerts) {
  $("#js-error-message").empty();
  $("#results-list").empty();
  for (let i = 0; i < 10; i++) {
    var date = new Date(concerts._embedded.events[i].dates.start.localDate);
    const fixDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    let artistName;
    if(concerts._embedded.events[i]._embedded.attractions) {
      artistName = `${
        concerts._embedded.events[i]._embedded.attractions[0].name}`
    } else {
      artistName = "";
    }
    const pictures = concerts._embedded.events[i].images;
    const highResPic = pictures.filter(picture => {
      return picture.ratio === "4_3";
    });
    $("#results-list").append(
      `<li class="eachResult">

            <div class="picContainer">
              <img class="concertPic" src="${
                highResPic[0].url
              }" width="225px" height="160px" class="show-image" alt="${
        concerts._embedded.events[i].name
      }">
            </div>
            <div class="info">
              <div class="textBlock">
                <div class="date">${fixDate}</div>
                <div class="title">${concerts._embedded.events[i].name}</div>
                <div class="concertLocation">@ ${
                  concerts._embedded.events[i]._embedded.venues[0].name
                }</div>
              </div>
              <div class="button">
                <button class="getAudioButton" artistName='${artistName}' item-index="${i}">Play Music</button>
                <button class="tickets" onClick="window.open('${
                  concerts._embedded.events[i].url
                }')">Buy Tickets</button>
                <div class='audioPlayer'></div>
                <div class="error" item-index='${i}'></div>
              </div>
            </div>

        </li>
       `
    );
  }
  getAudioPlayer();
}

//uses RapidAPI to call iTunes api
//iTunes API response data appended to each .audioPlayer
function getAudioPlayer() {
  $("#results-list").on("click", ".getAudioButton", event => {
    const itemIndex = event.target.getAttribute("item-index");
    const artist = event.target.getAttribute("artistName");
    const formatArtist = artist
      .replace(" ", "-")
      .replace("!", "i")
      .toLowerCase();
    if(!artist) {
      $(".error")
        .eq(itemIndex)
        .text("Music Unavailable")
        .css("color", "red");
    } else {

    fetch(
      `http://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${formatArtist}&type=artist`
    )
      .then(res => {
        let json = res.json();
        if (res.ok) {
          return json;
        }
        return Promise.reject(res.statusText);
      })
      .catch(err => console.log(err))
      .then(res => {
        if (res.meta.totalCount !== 0) {
          fetch(
            res.search.data.artists[0].links.topTracks.href +
              "?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4"
          )
            .then(res => {
              if (res.ok) {
                return res.json();
              }
            })
            .catch($("error").text("Music Unavailable"))
            .then(res => {
              $(".audioPlayer")
                .eq(itemIndex)
                .html(
                  `<audio controls><source src='${
                    res.tracks[0].previewURL
                  }' type="audio/mpeg" </audio>`
                );
            });
        } else {
          $(".error")
            .eq(itemIndex)
            .text("Music Unavailable")
            .css("color", "red");
        }
      });
  }});
}
$(function() {
  goHome();
})
