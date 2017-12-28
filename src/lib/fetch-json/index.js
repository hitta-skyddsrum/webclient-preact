import 'whatwg-fetch';

export default url => fetch(url)
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  });
