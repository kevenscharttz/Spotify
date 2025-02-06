require('dotenv').config(); // Essa linha carrega as variáveis de ambiente

const axios = require('axios');
const qs = require('qs');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const authHeader = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');

// Obtendo o token de acesso
async function getAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

// Função para buscar artistas
async function searchArtist(artistName) {
    const token = await getAccessToken();
    if (!token) {
        console.error('Failed to get access token');
        return;
    }

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;

    try {
        const response = await axios.get(searchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const artists = response.data.artists.items;
        if (artists.length > 0) {
            console.log('Artists found:');
            artists.forEach((artist) => {
                console.log(`Name: ${artist.name}, Genre: ${artist.genres.join(', ')}`);
            });
        } else {
            console.log('No artists found');
        }
    } catch (error) {
        console.error('Error searching for artist:', error);
    }
}

// Testando a função com um nome de artista
searchArtist('Adele');
