import { expect } from 'chai';
import sinon from 'sinon';

import makeServiceWorkerEnv from 'service-worker-mock';

describe('ServiceWorker/message', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    Object.assign(global,
      makeServiceWorkerEnv(),
      { serviceWorkerOption: { assets: [] } },
    );
    global.fetch = () => Promise.resolve();
    process.env.COMMITHASH = 'hash-132';
    jest.resetModules();
    require('./sw');
  });

  afterAll(() => {
    sandbox.restore();
  });

  it('should call `skipWaiting` upon message event containing `skipWaiting`', () => {
    sandbox.spy(self, 'skipWaiting');
    self.trigger('message', Object.assign(new Event(), { data: 'skipWaiting' }));

    expect(self.skipWaiting).to.have.been.calledOnce;
  });
});

describe('ServiceWorker/install', () => {
  const assets = [
    '/big.js',
    '/image.png',
    '/_redirects',
    '/sitemap.xml',
    '/sitemap2.xml',
  ];
  const sandbox = sinon.createSandbox();

  beforeAll(() => {
    jest.mock('raven-js');
  });

  beforeEach(() => {
    Object.assign(global,
      makeServiceWorkerEnv(),
      { serviceWorkerOption: { assets } },
    );
    global.fetch = () => Promise.resolve();
    process.env.COMMITHASH = 'hash-132';
    jest.resetModules();
    require('./sw');
  });

  afterEach(() => {
    sandbox.restore();
  });

  afterAll(() => {
    jest.unmock('raven-js');
  });

  it('use process.env.COMMITHASH as cache key', async () => {
    sinon.spy(global.caches, 'open');
    await self.trigger('install');
    expect(global.caches.open).to.have.been.calledWith(process.env.COMMITHASH);
  });

  it('should add appropriate assets to cache', async () => {
    sinon.stub(global, 'fetch').returns(Promise.resolve('fake'));
    await self.trigger('install');

    expect(self.snapshot().caches[process.env.COMMITHASH]).to.eql(
      [ ...assets, '/' ]
        .filter(path => ['/_redirects', '/sitemap.xml', '/sitemap2.xml'].indexOf(path) === -1)
        .map(path => new URL(path, global.location).toString())
        .reduce((output, asset) => ({ ...output, [asset]: 'fake' }), {})
    );
  });

  it('shoud catch add to cache exception with Raven', async () => {
    const Raven = require('raven-js');
    const error = new Error();
    sandbox.stub(global, 'fetch').returns(Promise.reject(error));

    await self.trigger('install');

    expect(Raven.captureException).to.have.been.calledWith(error);
  });
});

describe('ServiceWorker/activate', () => {
  const sandbox = sinon.createSandbox();

  beforeAll(() => {
    jest.mock('raven-js');
  });

  beforeEach(() => {
    Object.assign(global,
      makeServiceWorkerEnv(),
      { serviceWorkerOption: {
        assets: [],
      } },
    );
    process.env.COMMITHASH = 'hash24';
    jest.resetModules();
    require('./sw');
  });

  afterEach(() => {
    sandbox.restore();
  });

  afterAll(() => {
    jest.unmock('raven-js');
  });

  it('clean the caches', async () => {
    await self.caches.open('VERY_OLD_CACHE');
    await self.caches.open('OLD_CACHE');

    expect(self.snapshot().caches.VERY_OLD_CACHE).to.not.be.undefined;
    expect(self.snapshot().caches.OLD_CACHE).to.not.be.undefined;

    await self.trigger('activate');

    expect(self.snapshot().caches.VERY_OLD_CACHE).to.be.undefined;
    expect(self.snapshot().caches.OLD_CACHE).to.be.undefined;
  });

  it('shoud catch clean cache exception with Raven', async () => {
    const Raven = require('raven-js');
    const error = new Error();
    sandbox.stub(global.caches, 'keys').returns(Promise.reject(error));

    await self.trigger('activate');

    expect(Raven.captureException).to.have.been.calledWith(error);
  });
});

describe('ServiceWorker/fetch', () => {
  const sandbox = sinon.createSandbox();

  beforeAll(() => {
    jest.mock('raven-js');
  });

  beforeEach(() => {
    Object.assign(global,
      makeServiceWorkerEnv(),
      { serviceWorkerOption: {
        assets: [],
      } },
    );
    jest.resetModules();
    process.env.COMMITHASH = 'cache';
    require('./sw');
  });

  afterEach(() => {
    sandbox.restore();
  });

  afterAll(() => {
    jest.unmock('raven-js');
  });

  it('should return cached response upon a GET request from same origin', async () => {
    const cachedResponse = { clone: () => {} };
    const cachedRequest = new Request('/cache-me');
    const cache = await self.caches.open('king');
    cache.put(cachedRequest, cachedResponse);

    const response = await self.trigger('fetch', cachedRequest);
    expect(response).to.equal(cachedResponse);
  });

  it('should not return cached response upon a GET request from unknown origin', async () => {
    const cachedResponse = { cached: 'response' };
    const cachedRequest = new Request('https://dont.cache/me');
    const cache = await self.caches.open('king');
    cache.put(cachedRequest, cachedResponse);

    const response = await self.trigger('fetch', cachedRequest);
    expect(response).to.not.equal(cachedResponse);
  });

  it('should not return cached non-GET requests', async () => {
    const cachedResponse = { cached: 'response' };
    const cachedRequest = new Request('/post-resource', { method: 'POST' });
    const cache = await self.caches.open('king');
    cache.put(cachedRequest, cachedResponse);

    const response = await self.trigger('fetch', cachedRequest);
    expect(response).to.not.equal(cachedResponse);
  });

  it('should not store requests with bad response', async () => {
    global.fetch = sinon.stub();
    const commitHash = process.env.COMMITHASH;
    fetch.onCall(0).returns(Promise.resolve({}));
    fetch.onCall(1).returns(Promise.resolve({ ok: false }));

    const request = new Request('/get-me');

    const response = await self.trigger('fetch', request);
    
    expect(response).to.eql({});

    const secondResponse = await self.trigger('fetch', request);

    expect(secondResponse).to.eql({ ok: false });

    expect(self.snapshot().caches[commitHash]).to.be.undefined;
  });

  it('should return a cache upon a successfull request', async () => {
    const networkResponse = {
      ok: true,
      succ: 'ess',
      clone: () => networkResponse,
    };
    const request = new Request('/dressed-for-success');
    const commitHash = process.env.COMMITHASH;
    global.fetch = sinon.stub();
    fetch.returns(Promise.resolve(networkResponse));

    const response = await self.trigger('fetch', request);

    expect(response).to.equal(networkResponse);
    expect(self.snapshot().caches[commitHash][request.url]).to.eql(networkResponse);
  });

  it('shoud catch exception with Raven upon store to cache error', async () => {
    const Raven = require('raven-js');
    const error = new Error();
    global.fetch = sandbox.stub().returns(Promise.resolve({ ok: true, clone: sinon.spy() }));
    sandbox.stub(global.caches, 'open').returns(Promise.reject(error));

    await self.trigger('fetch', new Request('throw.me'));

    return Promise.resolve()
      .then(() => {
        expect(Raven.captureException).to.have.been.calledWith(error);
      });
  });

  it('should return the error upon failure', () => {
    const networkError = new Error();
    const request = new Request('/dressed-for-depress');
    global.fetch = sinon.stub();
    fetch.returns(Promise.reject(networkError));

    return self.trigger('fetch', request)
      .then(() => {
        expect(false).to.equal(true);
      })
      .catch(err => {
        expect(err).to.equal(networkError);
      });
  });
});
