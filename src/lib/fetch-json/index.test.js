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
    const status = 401;
    const jsonResp = { resp: 'onse' };
    fetchMock.getOnce(url, {
      body: jsonResp,
      status,
    });

    return fetchJson(url)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error);
        expect(error.response).to.be.an.instanceof(Object);
        expect(error.status).to.equal(status);
        expect(error.jsonResponse).to.eql(jsonResp);
      });
  });
});
