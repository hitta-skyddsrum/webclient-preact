import { h, Component } from 'preact';
import { autobind } from 'core-decorators';
import { route } from 'preact-router';
import classNames from 'classnames';
import AlgoliacePlaces from 'algolia-places-react';
import styles from './style.scss';

export default class SearchBox extends Component {
  @autobind
  handleAddressSelection({ suggestion }) {
    route(`/skyddsrum?lat=${suggestion.latlng.lat}&lon=${suggestion.latlng.lng}`, false);
    this.props.onSelectAddress(suggestion);
  }

  render() {
    return (
      <div className={classNames(styles.algolia, this.props.styles)}>
        <AlgoliacePlaces
          options={{
            language: 'sv',
            countries: ['se'],
          }}
          onChange={this.handleAddressSelection}
          placeholder="Var vill du söka från?"
        />
      </div>
    );
  }
}
