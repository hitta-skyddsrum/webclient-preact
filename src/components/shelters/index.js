import { h, Component } from 'preact';
import { route } from 'preact-router';
import { autobind } from 'core-decorators';
import Helmet from 'preact-helmet';

import SheltersMap from '../shelters-map';
import ErrorDialog from '../error-dialog';
import LoadingIndicator from '../loading-indicator';
import ShelterDetail from '../shelter-detail';
import SearchBox from '../../containers/search-box';

import style from './style.scss';

export default class Shelters extends Component {
  static defaultProps = {
    youAreHere: [],
    mapBottomPadding: 0,
  };

  state = {
    hideShelterDetail: true,
  };

  componentWillMount() {
    if (!this.props.youAreHere.length) {
      this.setState({ center: [62.166667, 14.95] });
    } else {
      this.setState({ center: this.props.youAreHere });
    }

    if (this.props.selectedShelterId) {
      this.props.onSelectShelter(this.props.selectedShelterId);
    } else {
      this.props.fetchShelters(this.props.youAreHere);
      this.props.reverseGeocode(this.props.youAreHere);
    }
  }

  componentDidMount() {
    this.shelterDetailElem.base.addEventListener('transitionend', this.setMapBottomPadding.bind(this));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.selectedShelterId !== this.props.selectedShelterId) {
      if (nextProps.selectedShelterId) {
        this.props.onSelectShelter(nextProps.selectedShelterId);
      } else {
        this.props.onUnselectShelter();
        this.props.fetchShelters(nextProps.youAreHere);
      }
    } else if (nextProps.youAreHere.join(',') !== this.props.youAreHere.join(',')) {
      this.props.fetchShelters(nextProps.youAreHere);
    }

    if (nextProps.selectedShelter !== this.props.selectedShelter) {
      this.setState({ hideShelterDetail: !nextProps.selectedShelter });
    }
  }

  componeDidUnmount() {
    this.shelterDetailElem.base.removeEventListener('transitionend', this.setMapBottomPadding.bind(this));
  }

  setMapBottomPadding() {
    const mapBottomPadding = !this.shelterDetailElem ? 0 : this.shelterDetailElem.base.firstChild.offsetHeight;
    this.setState({
      mapBottomPadding,
    });
  }

  @autobind
  handleCloseShelterDetail() {
    this.setState({ hideShelterDetail: true });
  }

  @autobind
  handleClickShelter({ id }) {
    const url = `/skyddsrum/${id}${location.search}`;
    route(url, false);
    this.setState({ hideShelterDetail: false });
  }

  render() {
    return (<div>
      {!!this.props.selectedAddress.name && (
        <Helmet
          title={`Skyddsrum nära ${this.props.selectedAddress.name}`}
        />
      )}
      {!!this.props.loading && <LoadingIndicator />}
      {this.props.humanError && <ErrorDialog
        title={this.props.humanError.message}
        desc={this.props.humanError.desc}
        handleClose={this.props.onCloseErrorDialog}
      />}
      <div class={style.shadowHeader} />
      <SearchBox
        styles={style.searchBox}
        onSelectAddress={this.props.onSelectAddress}
      />
      <SheltersMap
        center={this.state.center}
        youAreHere={this.props.youAreHere}
        shelters={this.props.shelters}
        routes={this.props.routes}
        onSelectShelter={this.handleClickShelter}
        bounds={this.props.bounds}
        bottomPadding={this.state.mapBottomPadding}
        selectedShelterId={this.props.selectedShelterId}
      />
      <ShelterDetail
        open={!this.state.hideShelterDetail}
        shelter={this.props.selectedShelter}
        onClose={this.handleCloseShelterDetail}
        ref={elem => { this.shelterDetailElem = elem; }}
      />
    </div>);
  }
}
