import { h, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import AlgoliacePlaces from 'algolia-places-react';
import ErrorDialog from '../error-dialog';
import Tooltip from '../tooltip';
import styles from './style.scss';

export default class SearchBox extends Component {
  state = {
    error: null,
  };

  constructor() {
    super();

    this.handleAddressSelection = this.handleAddressSelection.bind(this);
    this.handleAlgoliaLimit = this.handleAlgoliaLimit.bind(this);
    this.handleAlgoliaError = this.handleAlgoliaError.bind(this);
    this.handleCloseErrorDialog = this.handleCloseErrorDialog.bind(this);
    this.setContainerRef = this.setContainerRef.bind(this);
  }

  componentDidMount() {
    this.containerRef.querySelector('.ap-icon-pin')
      .addEventListener('click', this.props.onGeolocation);
  }

  handleAddressSelection({ suggestion }) {
    route(`/skyddsrum?lat=${suggestion.latlng.lat}&lon=${suggestion.latlng.lng}`, false);
    this.props.onSelectAddress(suggestion);
  }

  handleAlgoliaLimit() {
    this.setState({
      error: {
        title: 'Adressförslagen kunde inte hämtas',
        desc: <div>Tjänsten är för tillfället överbelastad och kan därmed inte visa förslag utifrån din sökning. Vi rekommenderar att du istället besöker <a href="https://gisapp.msb.se/apps/kartportal/enkel-karta_skyddsrum/">MSB</a> för att hitta ditt närmaste skyddsrum.</div>,
      },
    });

    throw new Error('AlgoliaPlaces: Rate limit');
  }

  handleAlgoliaError(error) {
    this.setState({
      error: {
        title: 'Addressförslagen kunde inte hämtas',
        desc: <div>Tjänsten för att hämta addressförslag är för tillfället inte tillgänglig. Vi rekommenderar att du istället besöker <a href="https://gisapp.msb.se/apps/kartportal/enkel-karta_skyddsrum/">MSB</a> för att hitta ditt närmaste skyddsrum.</div>,
      },
    });

    throw new Error(error);
  }

  handleCloseErrorDialog() {
    this.setState({ error: null });
  }

  setContainerRef(ref) {
    this.containerRef = ref;
  }

  render(props, { error }) {
    return (
      <div ref={this.setContainerRef}>
        {error &&
          <ErrorDialog
            title={error.title}
            desc={error.desc}
            handleClose={this.handleCloseErrorDialog}
          />
        }
        <div className={classNames(styles.algolia, props.styles)}>
          <Tooltip title="Klicka här för att söka utifrån din position." />
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
            onLimit={this.handleAlgoliaLimit}
            onError={this.handleAlgoliaError}
            placeholder="Var vill du söka från?"
          />
        </div>
      </div>
    );
  }
}
