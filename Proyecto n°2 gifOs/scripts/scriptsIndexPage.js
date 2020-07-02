const $apikey = 'UOL3lcP2fQqwUqxTXiL4RyuBBfyAIQE2';

//Sugerencias + seleccion random
const $suggestionsArray = ['Barney Stinson', 'Ferrari', 'Sony', 'Metal Gear', 'Apple', 'Greys Anatomy', 'F1', 'Play Station', 'Futbol'];
const $suggestionsRandomPick = $suggestionsArray[Math.floor(Math.random() * $suggestionsArray.length)];

//
function reloadPage() {
    location.reload();
}

let searchTextField = document.getElementById('search-textfield');
let searchBtn = document.getElementById("search-btn");
let lupa = document.getElementById('lupa');
let buscar = document.getElementById('search');

searchTextField.addEventListener("focus", searchBtnFocus);
searchTextField.addEventListener("blur", searchBtnBlur);

//Funcion para el foco del boton de busqueda
function searchBtnFocus() {

    if ((localStorage.getItem("theme")) == ("styles/day.css")) {
        searchBtn.disabled = false;
        searchBtn.style.background = '#F7C9F3';
        searchBtn.style.border = '1px solid #110038';
        searchBtn.style.boxshadow = 'inset -1px -1px 0 0 #997D97, inset 1px 1px 0 0 #FFFFFF';
        buscar.style.color = 'black';
        lupa.style.filter = 'invert(100%)';
    } else {
        searchBtn.disabled = false;
        searchBtn.style.background = '#EE3EFE';
        searchBtn.style.border = '1px solid #110038';
        searchBtn.style.boxshadow = 'inset -1px -1px 0 0 #A72CB3, inset 1px 1px 0 0 #FFFFFF';
        buscar.style.color = 'white';
        lupa.style.filter = 'invert(1%)';
    }
}

//Funcion para el foco del boton de busqueda
function searchBtnBlur() {

    if ((localStorage.getItem("theme")) == ("styles/day.css")) {
        searchBtn.style.background = '#E6E6E6';
        searchBtn.style.border = '1px solid #808080';
        searchBtn.style.boxshadow = 'inset -1px -1px 0 0 #B4B4B4, inset 1px 1px 0 0 #FFFFFF';
        buscar.style.color = '#B4B4B4';
        lupa.style.filter = 'invert(45%)';

    } else {
        searchBtn.style.background = '#B4B4B4';
        searchBtn.style.border = '1px solid #808080';
        searchBtn.style.boxshadow = 'inset -1px -1px 0 0 #B4B4B4, inset 1px 1px 0 0 #FFFFFF';
        buscar.style.color = '#8F8F8F';
        lupa.style.filter = 'invert(45%)';
    }
}

//Funcion para generar el localstorage de las busqueadas realizadas
function savedSearchesLS() {
    return localStorage.getItem('searches') == undefined ?
        localStorage.setItem('searches', '[]') :
        console.log('Local Storage ya generado');
}

//Menú desplegable donde están los 2 themes 
function themeMenu() {
    var div = document.getElementsByClassName('theme-menu')[0];
    if (div.style.display == 'flex') {
        div.style.display = 'none';
    } else {
        div.style.display = 'flex';
    }
}

//Cambio de theme
function changetheme(cssfile) {
    document.getElementById('csstheme').setAttribute('href', cssfile);
    localStorage.setItem('theme', cssfile);
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

    var valorBuscado = document.getElementById('search-textfield').value;

    if (valorBuscado == '') {
        document.getElementById("search-btn").disabled = true;
    } else {
        if (search == undefined) {
            var search = document.getElementById('search-textfield').value;
        }
        const found =
            fetch('https://api.giphy.com/v1/gifs/search?q=' + search +
                '&api_key=' + $apikey)
            .then((response) => {

                return response.json()
            }).then(data => {
                for (i = 0; i <= 9; i++) {
                    var $trendingGif = data.data;
                    var divv = document.getElementById('trending-gif' + i);
                    let prueba2 = document.getElementById('trending-gif-bar' + i);
                    gif = $trendingGif[i].images.original.url;
                    let title1 = $trendingGif[i].title.slice(0, 35);
                    divv.style.backgroundImage = 'url(' + gif + ')';
                    prueba2.innerHTML = '#' + title1;
                }
            })
            .catch((error) => {
                return error
            })

        var suggestionsSection = document.getElementsByClassName('suggestions')[0];
        let suggestionsText = document.getElementById('suggestions-text');

        suggestionsSection.style.display = 'none';
        suggestionsText.innerHTML = ('Tu busqueda en gifOS: ' + search);

        let searches = JSON.parse(localStorage.getItem('searches'));
        searches.push(search);
        localStorage.setItem('searches', JSON.stringify(searches));
        savedSearches();
        document.getElementById('search-textfield').value = '';
    }
}

//Funcion para el auto-suggest del buscador

document.addEventListener('keydown', logKey);


function logKey(e) {
    let $inputTeclado = document.getElementById('search-textfield').value

    function buscadorJs() {
        fetch('https://api.giphy.com/v1/gifs/search/tags?' + '&api_key=' + $apikey + '&q=' + $inputTeclado)
            .then((response) => {
                return response.json()

            }).then(data => {
                for (i = 0; i < 3; i++) {
                    var $obj = data.data[i].name
                    $result = document.getElementById('result-text' + i)
                    $result.innerHTML = ($obj)
                    document.getElementById('search-results').style.display = 'flex';
                }

                return data;
            })
    }
    buscadorJs();
}

//Función para las Tendencias.
let $trendinglimit = '10';

function trending() {
    const found =
        fetch('https://api.giphy.com/v1/gifs/trending?' + '&api_key=' + $apikey + '&limit=' + $trendinglimit)
        .then((response) => {
            return response.json()
        }).then(data => {
            for (i = 0; i <= 9; i++) {
                var $trendingGif = data.data;
                var divv = document.getElementById('trending-gif' + i);
                let prueba2 = document.getElementById('trending-gif-bar' + i);
                gif = $trendingGif[i].images.original.url;
                let title1 = $trendingGif[i].title.slice(0, 35);
                divv.style.backgroundImage = 'url(' + gif + ')';
                prueba2.innerHTML = '#' + title1;
            }
        })
        .catch((error) => {
            return error
        })
    return found

}

//Función para los gif sugeridos
function suggestions() {
    fetch('https://api.giphy.com/v1/gifs/search?' + 'api_key=' + $apikey + '&q=' + $suggestionsRandomPick + '&limit=4')
        .then((response) => {
            return response.json()
        }).then(data => {
            for (i = 0; i <= 3; i++) {
                var $suggestionGifUrl = data.data;
                var suggestionGif = document.getElementById('suggestions-gif' + i);
                let hashtagSuggestion = document.getElementById('#' + i);
                gif2 = $suggestionGifUrl[i].images.original.url;
                let title2 = $suggestionGifUrl[i].title.slice(0, 35);
                suggestionGif.style.backgroundImage = 'url(' + gif2 + ')';
                hashtagSuggestion.innerHTML = '#' + title2;
            }
        })
        .catch((error) => {
            alert('Error al obtener las sugerencias, recargar la página');
            return error
        })
}

//Funciones donde se obtienen las busquedas guardadas en el ls, y se muestran en forma de btns
function savedSearches() {
    let $savedSearches = JSON.parse(localStorage.getItem('searches'));
    let $sectionButtons = document.getElementById('saved-searches');
    $count = $savedSearches.length - 1;

    $count <= 1 ?
        $sectionButtons.style.display = 'inline' :
        console.log('Ya avanzo de 0');

    $sectionButtons.style.display = 'inline';
    let $btns = document.createElement('button');
    $sectionButtons.appendChild($btns);
    $btns.setAttribute('class', 'saved-searches-btn');
    $btns.setAttribute('id', 'saved-searches-btn' + $count);
    let $busquedas = document.getElementById('saved-searches-btn' + $count);
    $busquedas.innerHTML = '#' + $savedSearches[$count]
    $busquedas.style.display = 'inline';
    document.getElementById('search-results').style.display = 'none';
}

function createBtns() {
    let $savedSearches = JSON.parse(localStorage.getItem('searches'));
    let $sectionButtons = document.getElementById('saved-searches');
    $count = $savedSearches.length - 1;

    if ($savedSearches != undefined && $savedSearches.length > 0) {
        for (let i = 0; i < $savedSearches.length; i++) {

            i == '0' ?
                $sectionButtons.style.display = 'inline' :
                console.log('Ya avanzo de 0 y esta llegando a 4');

            $sectionButtons.style.display = 'inline';
            let $btns = document.createElement('button');
            $sectionButtons.appendChild($btns);
            $btns.setAttribute('class', 'saved-searches-btn');
            $btns.setAttribute('id', 'saved-searches-btn' + i);
            let $busquedas = document.getElementById('saved-searches-btn' + i);
            $busquedas.innerHTML = '#' + $savedSearches[i]
            $busquedas.style.display = 'inline';

        }
    }

}

//Ejecuciones de funciones
savedSearchesLS();
createBtns();
trending();
suggestions();