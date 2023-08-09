import axios from "axios";
import { readFileSync } from "fs";


const data = readFileSync('./auth/data/twitch.json');

const tokenData = JSON.parse(data);

const config = {
    headers: {
        Authorization: `OAuth ${tokenData.accessToken}`
    }
}

try {
    // Exchange the authorization code for access and refresh tokens
    const response = await axios.get('https://id.twitch.tv/oauth2/validate', config);

    console.log(response.data)

  } catch (error) {
    console.error('Error:', error.message);
  }