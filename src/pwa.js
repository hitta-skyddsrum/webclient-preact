import { h, render } from 'preact';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

const displayToast = () =>
  import('components/update-available')
    .then(module => module.default)
    .then(UpdateAvailable => {
      render(<UpdateAvailable />, document.querySelector('#update-available'));
    });


window.addEventListener('load', () => {
  runtime.register()
    .then(reg => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            displayToast();
          }
        };
      };
    });
});

