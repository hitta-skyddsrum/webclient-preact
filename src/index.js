import { h, render } from 'preact';
import polyfill from 'dynamic-polyfill';

let root;

function init() {
  let App = require('./containers/app').default;

  root = render(<App/>, document.body, root);
}

// in development, set up HMR:
if (module.hot) {
  //require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./containers/app', () => requestAnimationFrame(init));
}

polyfill({
  fills: [
    'fetch',
    'Array.prototype.filter',
    'Array.prototype.find',
    'Object.assign',
    'Promise',
    'Element.prototype.classList',
  ],
  options: ['gated'],
  minify: true,
  rum: false,
  afterFill() {
    init();
  },
});

if (process.env.NODE_ENV==='production') {
  require('./pwa');
}

