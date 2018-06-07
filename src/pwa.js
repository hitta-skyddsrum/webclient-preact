import { h, render } from 'preact';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

/* eslint-disable compat/compat */

const postMessage = () =>
  window.navigator.serviceWorker.ready
    .then(sw => sw.waiting.postMessage('skipWaiting'));

const displayToast = () =>
  import('components/update-available')
    .then(module => module.default)
    .then(UpdateAvailable => {
      render(<UpdateAvailable onUpdate={postMessage} />, document.querySelector('#update-available'));
    });

navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});

window.addEventListener('load', () => {
  runtime.register()
    .then(reg => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            displayToast();
          }
        };
      };
    });
});

