import { h, Component } from 'preact';
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';

import LoadingIndicator from '../components/loading-indicator';
import OmTjansten from '../components/om-tjansten';
import VadArEttSkyddsrum from '../components/vad-ar-ett-skyddsrum';
import NotFound from '../components/not-found';
import Redirect from './redirect/index';

export const loadHome = () =>
  import('./home')
    .then(module => module.default);

export const loadShelters = () =>
  import('./shelters')
    .then(module => module.default);

export default class Routes extends Component {
  render() {
    return (
      <Router history={this.props.history}>
        <AsyncRoute path="/" getComponent={loadHome} loading={() => <LoadingIndicator />} />
        <Redirect path="skyddsrum/koordinater/:lat/:lon" to="skyddsrum?lat=:lat&lon=:lon" />
        <AsyncRoute path="skyddsrum/:id?" getComponent={loadShelters} loading={() => <LoadingIndicator />} />
        <VadArEttSkyddsrum path="vad-ar-ett-skyddsrum" />
        <OmTjansten path="om-tjansten" />
        <NotFound default />
      </Router>
    );
  }
}
