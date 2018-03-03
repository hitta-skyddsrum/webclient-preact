# Hitta skyddsrum - Web client [![Build Status](https://travis-ci.org/hitta-skyddsrum/webclient-preact.svg?branch=master)](https://travis-ci.org/hitta-skyddsrum/webclient-preact) [![codecov.io](https://img.shields.io/codecov/c/github/hitta-skyddsrum/webclient-preact.svg?branch=master&style=flat-square)](https://codecov.io/github/hitta-skyddsrum/webclient-preact?branch=master)

Thanks to 
* [BrowserStack](https://browserstack.com) for simple browser testing.
* [Algolia Places](https://community.algolia.com/places/) for blazing fast address autocompletion with [Algolia Places React](https://npm.im/algolia-places-react).
* [LocationIQ](https://locationiq.org/) for quick reverse geocoding and simple API.
* [Sentry](https://sentry.io) for simple error reporting and handling.
* [Openrouteservices](https://openrouteservice.org/) for excellent guidence.

## Development
```
git clone https://github.com/hitta-skyddsrum/webclient-preact
npm install
npm run dev
```

## Testing

### Unit
```
npm test
```

### e2e
```
npm run install-selenium
npm run e2e
```
