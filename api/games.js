export default ($http) => ({
  get(date) {
    const host = process.env.API_HOST;
    const v = process.env.API_V;
    const url = date ? `${host}/${v}/games?date=${date}` : `${host}/${v}/games`;

    return $http.$get(url);
  }
})