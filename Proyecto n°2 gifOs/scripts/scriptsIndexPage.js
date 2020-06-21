const $apikey = 'UOL3lcP2fQqwUqxTXiL4RyuBBfyAIQE2';

//Sugerencias + seleccion random
const $suggestionsArray = ["Barney Stinson", "Ferrari", "Sony", "Samsung", "Apple", "Greys Anatomy", "F1", "Play Station", "Futbol"];
const $suggestionsRandomPick = $suggestionsArray[Math.floor(Math.random() * $suggestionsArray.length)];

//
let tau = '1';

function reloadPage() {
  location.reload();
}

//Menú desplegable donde están los 2 themes 
function themeMenu() {
  var div = document.getElementsByClassName("theme-menu")[0];
  if (div.style.display == "flex") {
    div.style.display = "none";
  } else {
    div.style.display = "flex";
  }
}

//Cambio de theme
function changetheme(cssfile) {
  document.getElementById('csstheme').setAttribute('href', cssfile);
  localStorage.setItem("theme", cssfile);
}

//Cambio de logo
function changelogo(logo) {
  document.getElementById('logo').setAttribute('src', logo);
}

//Cambio de dropdown
function changedropdown(dropdown) {
  document.getElementById('dropdown').setAttribute('src', dropdown);
}

//Función para realizar la búsqueda de los GIF
function getSearchResults(search) {

  if (search == undefined) {
    var search = document.getElementById('search-textfield').value;
  }

  const found =
    fetch('http://api.giphy.com/v1/gifs/search?q=' + search +
      '&api_key=' + $apikey)
      .then((response) => {
        return response.json()
      }).then(data => {

        for (i = 0; i <= 9; i++) {
          var $trendingGif = data.data;
          var divv = document.getElementById("trending-gif" + i);
          let prueba2 = document.getElementById("trending-gif-bar" + i);
          gif = $trendingGif[i].images.original.url;
          let title1 = $trendingGif[i].title.slice(0, 35);
          divv.style.backgroundImage = "url(" + gif + ")";
          prueba2.innerHTML = "#" + title1;
        }
      })
      .catch((error) => {
        return error
      })

  tau = '1';
  searchBtn(trending());
}

//Función para las Tendencias.
let $trendinglimit = '10';

function trending() {
  const found =
    fetch('http://api.giphy.com/v1/gifs/trending?' + '&api_key=' + $apikey + '&limit=' + $trendinglimit)
      .then((response) => {
        return response.json()
      }).then(data => {
        for (i = 0; i <= 9; i++) {
          var $trendingGif = data.data;
          var divv = document.getElementById("trending-gif" + i);
          let prueba2 = document.getElementById("trending-gif-bar" + i);
          gif = $trendingGif[i].images.original.url;
          let title1 = $trendingGif[i].title.slice(0, 35);
          divv.style.backgroundImage = "url(" + gif + ")";
          prueba2.innerHTML = "#" + title1;
        }
      })
      .catch((error) => {
        return error
      })
  return found

}

//Función para los gif sugeridos
function suggestions() {
  fetch('http://api.giphy.com/v1/gifs/search?' + 'api_key=' + $apikey + '&q=' + $suggestionsRandomPick + '&limit=4')
    .then((response) => {
      return response.json()
    }).then(data => {
      for (i = 0; i <= 3; i++) {
        var $suggestionGifUrl = data.data;
        var suggestionGif = document.getElementById("suggestions-gif" + i);
        let hashtagSuggestion = document.getElementById("#" + i);
        gif2 = $suggestionGifUrl[i].images.original.url;
        let title2 = $suggestionGifUrl[i].title.slice(0, 35);
        suggestionGif.style.backgroundImage = "url(" + gif2 + ")";
        hashtagSuggestion.innerHTML = "#" + title2;
      }
    })
    .catch((error) => {
      alert("Error al obtener las sugerencias, recargar la página");
      return error
    })
}

//Ejecuciones de funciones
trending();
suggestions();

// Funcion de busqueda de gifs
function searchBtn() {
  var suggestionsSection = document.getElementsByClassName("suggestions")[0];
  let prueba1 = document.getElementById('suggestions-text');

  if (tau == '1') {
    suggestionsSection.style.display = "none";
    prueba1.innerHTML = "Tu busqueda en gifOS";

  } else {
    alert('La busqueda no se pudo realizar, reinicie la pagina')
  }
}