import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { autobind } from 'core-decorators';

import { fetchShelters, fetchRouteToShelter, selectShelter, unselectShelter, clearError, fetchSingleShelter } from './actions';
import SheltersMap from '../../components/shelters-map';
import ErrorDialog from '../../components/error-dialog';
import LoadingIndicator from '../../components/loading-indicator';
import ShelterDetail from '../../components/shelter-detail';

export class Shelters extends Component {
  state = {
    hideShelterDetail: false,
  };

  componentWillMount() {
    if (this.props.id) {
      this.props.handleSelectShelter(this.props.id);
    } else {
      this.props.fetchShelters(this.props.lat, this.props.lon);
    }
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.id && nextProps.id !== this.props.id) {
      this.setState({ bounds: this.getBoundsForShelters(nextProps.shelters) });
      this.props.handleUnselectShelter();
    }

    if (nextProps.id && nextProps.id !== this.props.id) {
      this.props.handleSelectShelter(nextProps.id);
    }

    if (nextProps.shelters.length && !this.props.shelters.length) {
      this.setState({ bounds: this.getBoundsForShelters(nextProps.shelters) });
    }

    if (nextProps.selectedShelter && nextProps.selectedShelter !== this.props.selectedShelter) {
      this.setState({ hideShelterDetail: false });
      if (this.props.lat) {
        this.props.fetchRouteToShelter({
          lon: this.props.lon,
          lat: this.props.lat,
        },
        {
          lon: nextProps.selectedShelter.position.long,
          lat: nextProps.selectedShelter.position.lat,
        });
      }
    }
  }

  getBoundsForShelters(shelters) {
    return [
      this.getShelterPosition(shelters, 'smallest'),
      this.getShelterPosition(shelters, 'biggest'),
    ];
  }

  getShelterPosition(shelters, sortedBy) {
    const biggest = sortedBy === 'biggest' ? true : false;

    const sorter = (a, b) => biggest ? b - a : a - b;

    return [
      shelters
        .map(shelter => parseFloat(shelter.position['lat']))
        .sort(sorter)
        .shift(),
      shelters
        .map(shelter => parseFloat(shelter.position['long']))
        .sort(sorter)
        .shift(),
    ];
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
      {!!this.props.loading && <LoadingIndicator />}
      {this.props.humanError && <ErrorDialog
        title={this.props.humanError.message}
        desc={this.props.humanError.desc}
        handleClose={this.props.clearError}
      />}
      <SheltersMap
        center={[this.props.lat, this.props.lon]}
        shelters={this.props.shelters}
        routes={this.props.routes}
        onSelectShelter={this.handleClickShelter}
        bounds={this.state.bounds}
      />
      {this.props.selectedShelter && <ShelterDetail
        open={!this.state.hideShelterDetail}
        shelter={this.props.selectedShelter}
        onClose={this.handleCloseShelterDetail}
      />}
    </div>);
  }
}

const mapStateToProps = state => {
  return state.Shelters;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleShelter: id => dispatch(fetchSingleShelter(id)),
    fetchShelters: (lat, lon) => dispatch(fetchShelters(lat, lon)),
    fetchRouteToShelter: (from, to) => dispatch(fetchRouteToShelter(from, to)),
    handleSelectShelter: shelter => dispatch(selectShelter(shelter)),
    handleUnselectShelter: () => dispatch(unselectShelter()),
    clearError: () => dispatch(clearError()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelters);
