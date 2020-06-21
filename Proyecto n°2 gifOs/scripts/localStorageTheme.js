function localStorageTheme() {
  return (localStorage.getItem("theme") == undefined) || (localStorage.getItem("theme") == ("styles/day.css"))
    ? document.getElementById('csstheme').setAttribute('href', "styles/day.css")
    : document.getElementById('csstheme').setAttribute('href', "styles/night.css");
}

localStorageTheme();