import fetchMock from 'fetch-mock';
import { expect } from 'chai';


import fetchJson from './';

describe('lib/fetch-json', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should return the response as json', () => {
    const url = 'https://json.url';
    const jsonBody = { this: 'is', json: 'response'};
    fetchMock.getOnce(url, { body: jsonBody });

    return fetchJson(url)
      .then(response => expect(response).to.eql(jsonBody));
  });

  it('should reject if the status code is other than 2xx', () => {
    const url = 'https://json.url';
    const statusText = 'Unauthorized';
    const response = new Response('', { status: 401, statusText });
    const error = new Error(statusText);
    error.response = response;
    fetchMock.getOnce(url, response);

    return fetchJson(url)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error);
        expect(error.response).to.be.an.instanceof(Object);
      });
  });
});
