import { h, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import AlgoliacePlaces from 'algolia-places-react';
import Tooltip from '../../containers/tooltip';
import styles from './style.scss';

export default class SearchBox extends Component {
  constructor() {
    super();

    this.handleAddressSelection = this.handleAddressSelection.bind(this);
    this.handleClickGeolocation = this.handleClickGeolocation.bind(this);
    this.setContainerRef = this.setContainerRef.bind(this);
  }

  componentDidMount() {
    this.containerRef.querySelector('.ap-icon-pin')
      .addEventListener('click', this.handleClickGeolocation);
  }

  handleAddressSelection({ suggestion }) {
    route(`/skyddsrum?lat=${suggestion.latlng.lat}&lon=${suggestion.latlng.lng}`, false);
    this.props.onSelectAddress(suggestion);
  }

  handleClickGeolocation() {
    this.containerRef.querySelector('input').blur();

    this.props.onGeolocation();
  }

  setContainerRef(ref) {
    this.containerRef = ref;
  }

  render(props) {
    return (
      <div ref={this.setContainerRef}>
        <div className={classNames(styles.algolia, props.styles, { [styles.loadingGeo]: this.props.loadingGeo })}>
          {window.localStorage && (
            <Tooltip tooltipId="geo_search" title="Klicka här för att söka utifrån din position." />
          )}
          <AlgoliacePlaces
            options={{
              apiKey: process.env.ALGOLIA_API_KEY,
              appId: process.env.ALGOLIA_APP_ID,
              language: 'sv',
              countries: ['se'],
            }}
            onBlur={this.props.onBlur}
            onChange={this.handleAddressSelection}
            onFocus={this.props.onFocus}
            onLimit={this.props.onLimit}
            onError={this.props.onSearchError}
            placeholder="Var vill du söka från?"
            {...(!this.props.loadingGeo ? {} : {
              disabled: true,
              value: 'Hämtar din position...',
            })}
          />
        </div>
      </div>
    );
  }
}
