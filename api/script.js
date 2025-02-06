// api/spotify.js
const axios = require('axios');
require('dotenv').config(); // Carrega as variáveis de ambiente

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const authHeader = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');

// Obtendo o token de acesso
async function getAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    try {
        const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${authHeader}`,
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
async function searchArtist(artistName, token) {
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;

    try {
        const response = await axios.get(searchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const artists = response.data.artists.items;
        if (artists.length > 0) {
            return artists.map((artist) => ({
                name: artist.name,
                genre: artist.genres.join(', '),
            }));
        } else {
            return 'No artists found';
        }
    } catch (error) {
        console.error('Error searching for artist:', error);
        return 'Error searching for artist';
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { artistName } = req.body;

        if (!artistName) {
            return res.status(400).json({ error: 'Artist name is required' });
        }

        const token = await getAccessToken();
        if (!token) {
            return res.status(500).json({ error: 'Failed to get access token' });
        }

        const artists = await searchArtist(artistName, token);
        return res.status(200).json(artists);
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
