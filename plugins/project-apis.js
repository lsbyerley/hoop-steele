// PROJECT: API
import Games from '@/api/games';

//https://api-usa.pointsbet.com/api/v2/competitions/21/events/featured?includeLive=true

export default (context, inject) => {
  if (process.client) {
    const token = localStorage.getItem('token');
    // Set token when defined
    if (token) {
      context.$http.setToken(token, 'Bearer');
    }
  }
  // Initialize API repositories
  const repositories = {
    games: Games(context.$http),
  };
  inject('api', repositories);
};
