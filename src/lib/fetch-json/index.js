export default url => fetch(url)
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }

    return response.json()
      .then(jsonResponse => {
        const error = new Error(response.statusText);
        error.response = response;
        error.jsonResponse = jsonResponse;
        error.status = response.status;
        throw error;
      });
  });
