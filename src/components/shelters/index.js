import { h, Component } from 'preact';
import { route } from 'preact-router';
import Helmet from 'preact-helmet';

import SheltersMap from '../shelters-map';
import LoadingIndicator from '../loading-indicator';
import MapNotification from '../map-notification';
import ShelterDetail from '../shelter-detail';
import SearchBox from '../../containers/search-box';

import style from './style.scss';

const arrayValueIsEqual = (first, second) => first.join(';;;') === second.join(';;;');

export default class Shelters extends Component {
  static defaultProps = {
    youAreHere: [],
  };

  state = {
    center: !this.props.youAreHere.length ? [62.166667, 14.95] : this.props.youAreHere,
    hideShelterDetail: true,
    limitedView: false,
  };

  constructor(props) {
    super(props);

    this.handleCloseShelterDetail = this.handleCloseShelterDetail.bind(this);
    this.handleClickShelter = this.handleClickShelter.bind(this);
    this.handleBBoxChange = this.handleBBoxChange.bind(this);
    this.handleSearchBoxBlur = this.handleSearchBoxBlur.bind(this);
    this.handleSearchBoxFocus = this.handleSearchBoxFocus.bind(this);

    if (this.props.selectedShelterId) {
      this.props.onSelectShelter(this.props.selectedShelterId);
    } else {
      this.props.fetchShelters(this.props.youAreHere);
      this.props.reverseGeocode(this.props.youAreHere);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (arrayValueIsEqual(nextProps.youAreHere, this.props.youAreHere) === false) {
      this.props.fetchShelters(nextProps.youAreHere);
      this.setState({
        center: nextProps.youAreHere,
      });
    }

    if (nextProps.selectedShelterId !== this.props.selectedShelterId) {
      if (nextProps.selectedShelterId) {
        this.props.onSelectShelter(nextProps.selectedShelterId);
      } else {
        this.props.onUnselectShelter();
      }
    }

    if (nextProps.selectedShelter !== this.props.selectedShelter) {
      this.setState({ hideShelterDetail: !nextProps.selectedShelter });
    }
  }

  handleBBoxChange({
    bbox,
    oldBBox,
    oldZoom,
    zoom,
  }) {
    // Fix Android keyboard trigger bbox change
    if (this.searchBoxFocus) return;

    if (this.props.bounds.length) {
      this.props.onSetBounds([]);
    }

    if (zoom < 14) {
      this.setState({
        limitedView: true,
      });

      return;
    }

    this.setState({
      limitedView: false,
    });

    if (zoom > oldZoom) {
      return;
    }

    if (bbox === oldBBox) {
      return;
    }

    if (this.bboxChangeDebounce) clearInterval(this.bboxChangeDebounce);

    this.bboxChangeDebounce = setInterval(() => {
      if (this.props.loading) {
        return;
      }

      clearInterval(this.bboxChangeDebounce);
      this.props.onBBoxChange(bbox);
    }, 100);
  }

  handleCloseShelterDetail() {
    this.setState({ hideShelterDetail: true });
  }

  handleClickShelter({ shelterId }) {
    /**
     * TODO: this.props.onSelectShelter() ?
     */
    const url = `/skyddsrum/${shelterId}${location.search}`;
    route(url, false);
    this.setState({ hideShelterDetail: false });
  }

  handleSearchBoxBlur() {
    this.searchBoxFocus = false;
  }

  handleSearchBoxFocus() {
    this.searchBoxFocus = true;
  }

  render() {
    return (<div className={style.maximize}>
      {!!this.props.selectedAddress.name && (
        <Helmet
          title={`Skyddsrum nära ${this.props.selectedAddress.name}`}
        />
      )}
      {!!this.props.loading && <LoadingIndicator />}
      {this.state.limitedView && (<MapNotification>
        Zooma in för att hämta skyddsrum.
      </MapNotification>)}
      <div class={style.shadowHeader} />
      <SearchBox
        styles={style.searchBox}
        onGeolocation={this.props.onGeolocation}
        onSelectAddress={this.props.onSelectAddress}
        onBlur={this.handleSearchBoxBlur}
        onFocus={this.handleSearchBoxFocus}
      />
      <SheltersMap
        center={this.state.center}
        features={this.props.features}
        youAreHere={this.props.youAreHere}
        shelters={this.props.shelters}
        onBBoxChange={this.handleBBoxChange}
        onSelectShelter={this.handleClickShelter}
        bounds={this.props.bounds}
        selectedShelterId={this.props.selectedShelterId}
      />
      <ShelterDetail
        open={!this.state.hideShelterDetail}
        shelter={this.props.selectedShelter}
        onClose={this.handleCloseShelterDetail}
      />
    </div>);
  }
}
