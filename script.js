const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById("result-playlists");
const searchInput = document.getElementById("search-input");

function requestApi(searchTerm) {
    const url = `http://localhost:3000/artists?name_like=${searchTerm}`;
    fetch(url)
        .then((Response) => Response.json())
        .then((Result) => displayResults(Result))
}

function displayResults(result) {
    resultPlaylist.classList.add("hidden");
    const artistName = document.getElementById("artist-name");
    const artistImage = document.getElementById("artist-img");

    result.forEach(element => {
        artistName.innerText = element.name;
        artistImage.src = element.urlImg;
    });

    resultArtist.classList.remove("hidden");
}

document.addEventListener("input", function() {
    //Dessa forma a variavel constante vai receber o valor do input, e esse valor vai ser passado automaticamente para minusculo.
    const searchTerm = searchInput.value.toLowerCase();
    //dois iguais servem para verificar igualdade, três servem para verificar igualdade e se são do mesmo tipo.
    if (searchTerm === "") {
        resultPlaylist.classList.add("hidden");
        resultArtist.classList.remove("hidden");
        return;
    }
    requestApi(searchTerm);
});