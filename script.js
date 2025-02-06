const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById("result-playlists");
const searchInput = document.getElementById("search-input");

const CLIENT_ID = "91b193add14d46edb3afaf47e5c4079a";
const CLIENT_SECRET = "7e999ece5e304333acef50bb3c626ff9";

// Função para obter o token do Spotify
async function getSpotifyToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        })
    });

    const data = await response.json();
    return data.access_token;
}

// Função para buscar artistas na API do Spotify
async function searchArtist(searchTerm) {
    const token = await getSpotifyToken(); // Obtém o token
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    return data.artists.items; // Retorna a lista de artistas
}

// Função para exibir os resultados na tela (agora com múltiplos artistas)
function displayResults(artists) {
    resultPlaylist.classList.add("hidden");
    resultArtist.classList.remove("hidden");

    // Limpa os resultados anteriores antes de adicionar novos cards
    resultArtist.innerHTML = '';

    // Se houver artistas, vamos criar um card para cada um
    artists.forEach(artist => {
        const artistCard = document.createElement("div");
        artistCard.classList.add("artist-card"); // Adicione uma classe para estilizar os cards

        // Cria a imagem e o nome do artista
        const artistImage = document.createElement("img");
        artistImage.src = artist.images.length > 0 ? artist.images[0].url : "img/default.jpg";
        artistImage.alt = artist.name;

        const artistName = document.createElement("h3");
        artistName.innerText = artist.name;

        // Adiciona a imagem e o nome ao card
        artistCard.appendChild(artistImage);
        artistCard.appendChild(artistName);

        // Adiciona o card à lista de artistas na página
        resultArtist.appendChild(artistCard);
    });
}

// Evento de input para pesquisar ao digitar
document.addEventListener("input", async function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        resultPlaylist.classList.add("hidden");
        resultArtist.classList.remove("hidden");
        return;
    }

    const artists = await searchArtist(searchTerm);
    displayResults(artists);
});
