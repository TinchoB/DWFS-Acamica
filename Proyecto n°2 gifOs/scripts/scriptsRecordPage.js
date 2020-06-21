const apiKey = 'UOL3lcP2fQqwUqxTXiL4RyuBBfyAIQE2';

//Funciones donde se generan los local storage
function idsLocalStorage() {
    return localStorage.getItem("gifIds") == undefined
        ? localStorage.setItem("gifIds", "[]")
        : console.log('Local Storage ya generado');
}

function lastGif() {
    return localStorage.getItem("lastGif") == undefined
        ? localStorage.setItem("lastGif", "")
        : console.log('Local Storage ya generado');
}

idsLocalStorage();
lastGif();


function reloadPage() {
    location.reload();
}

//Funciones para realizar la grabacion de los gifs
function getStreamAndRecord() {
    var video = document.getElementById("video");
    let record = document.getElementById("record");
    let recordHeader = document.getElementById("record-header");
    let article = document.getElementById("article");
    let footer = document.getElementById("footer");
    let btn9 = document.getElementById("btn9");
    let btn10 = document.getElementById("btn10");
    var btn11 = document.getElementById("btn11");
    var btn12 = document.getElementById("btn12");
    let videoContainer = document.getElementById("video-container");
    var preview = document.getElementById("preview");
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: { min: 640 }
        }
    }
    )
        .then(function (stream) {
            record.style.width = "667px";
            record.style.height = '586px';
            recordHeader.style.marginLeft = '4.5px';
            article.style.display = "none";
            footer.style.marginTop = "16px";
            footer.style.marginRight = "14px";
            footer.style.marginBottom = "0px";
            btn9.style.display = "none";
            btn10.style.display = "none";
            videoContainer.style.display = "block";
            btn11.style.display = "inline";
            btn12.style.display = "inline";
            preview.style.display = "none";

            video.srcObject = stream;
            video.play()
        })
};

function grabarGif() {
    let btn13 = document.getElementById("btn13");
    let btn14 = document.getElementById("btn14");
    let btn17 = document.getElementById("btn17");
    let btn18 = document.getElementById("btn18");

    navigator.mediaDevices.getUserMedia({
        video: true
    })
        .then(function (stream) {
            btn11.style.display = "none";
            btn12.style.display = "none";
            btn13.style.display = "inline";
            btn14.style.display = "inline";
            var recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 60,
                quality: 100,
                width: 640,
                height: 480,
            });
            recorder.startRecording();

            function detenerGrabacion() {
                recorder.stopRecording(function () {
                    let blob = recorder.getBlob();
                    let gifPreview = URL.createObjectURL(blob);

                    video.style.display = "none";
                    preview.src = gifPreview;
                    preview.style.display = "inline";
                });
                btn13.style.display = "none";
                btn14.style.display = "none";
                btn17.style.display = "inline";
                btn18.style.display = "inline";

                function subirGif() {
                    let gifIds = JSON.parse(localStorage.getItem("gifIds"));
                    var uploadDiv = document.getElementById("uploadDiv");
                    var btn19 = document.getElementById("btn19");
                    btn17.style.display = "none";
                    btn18.style.display = "none";
                    btn19.style.display = "inline";
                    uploadDiv.style.display = "flex";
                    preview.style.display = "none";

                    let form = new FormData();
                    form.append("file", recorder.getBlob(), "myGif.gif");

                    const upload = fetch(
                        "https://upload.giphy.com/v1/gifs" + "?api_key=" + apiKey,
                        {
                            method: "POST",
                            body: form
                        }
                    )
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            var gifId = data.data.id // ID del gif que se acaba de subir
                            setTimeout(previewGif(), 5000);
                            const searchId = fetch("https://api.giphy.com/v1/gifs/" + gifId + "?api_key=" + apiKey)
                                .then(response => {
                                    return response.json();
                                })
                                .then(data => {

                                    let $previewGif = data.data;
                                    let $urlGif = data.data.bitly_gif_url;
                                    let $urlPreviewGif = $previewGif.images.fixed_height_downsampled.url;
                                    let $preview = document.getElementById("Giifpreview");
                                    $preview.style.backgroundImage = "url(" + $urlPreviewGif + ")";
                                    $preview.style.backgroundSize = "cover";
                                    gifIds.push(gifId);
                                    localStorage.setItem("gifIds", JSON.stringify(gifIds));
                                    localStorage.setItem("lastGif", JSON.stringify($urlGif));
                                })
                            return searchId;
                        })
                        .catch(function (error) {
                            alert('El upload del gif falló - Error: ' + error)
                        });
                    return upload
                }
                btn18.addEventListener("click", subirGif);
            }
            btn14.addEventListener("click", detenerGrabacion);
        })

    function previewGif() {
        let cuadroPrincipal = document.getElementById("container-record-gif");
        let nuevoCuadro = document.getElementById("success");
        cuadroPrincipal.style.display = "none";
        nuevoCuadro.style.display = "inline";
    }
};

//Copiar y descargar el gif (Se abre en una nueva ventana)
function copyGif() {
    let texto = document.createElement("textarea");
    let $lastGif = localStorage.getItem("lastGif");
    texto.value = $lastGif
    document.body.appendChild(texto);
    texto.select();
    document.execCommand("copy");
    document.body.removeChild(texto);
    alert("El gif se copió al portapapeles");
}
function downloadGif() {
    let $lastGif = localStorage.getItem("lastGif");
    window.open($lastGif, "_blank");
}

function btnCancelar() {
    let hide = document.getElementById("container-record-gif");
    hide.style.display = "none";
}

function btnListo() {
    location.reload();
}

function localStorageGifs() {
    let gifIds = JSON.parse(localStorage.getItem("gifIds"));
    if (gifIds != undefined && gifIds.length > 0) {
        for (let i = 0; i < gifIds.length; i++) {
            let grid = document.getElementById("grid" + i);
            fetch("https://api.giphy.com/v1/gifs/" + gifIds[i] + "?api_key=" + apiKey)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    var gif = data.data.images.original.url;
                    grid.style.backgroundImage = "url(" + gif + ")";
                });
        }
    }
}

localStorageGifs();