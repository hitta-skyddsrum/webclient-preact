import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { fetchShelters, fetchRouteToShelter, selectShelter, clearError } from './actions';
import SheltersMap from '../../components/shelters-map';
import ErrorDialog from '../../components/error-dialog';
import LoadingIndicator from '../../components/loading-indicator';

export class Shelters extends Component {
  componentWillMount() {
    this.props.fetchShelters(this.props.lat, this.props.lon);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.shelters.length && !this.props.shelters.length) {
      const bounds = [
        [this.getShelterPosition(nextProps.shelters, 'lat', 'smallest'), this.getShelterPosition(nextProps.shelters, 'long', 'smallest')],
        [this.getShelterPosition(nextProps.shelters, 'lat', 'biggest'), this.getShelterPosition(nextProps.shelters, 'long', 'biggest')],
      ];

      this.setState({ bounds });
    }

    if (nextProps.selectedShelter !== this.props.selectedShelter) {
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

  getShelterPosition(shelters, axle, sortedBy) {
    const biggest = sortedBy === 'biggest' ? true : false;

    return shelters
      .map(shelter => parseFloat(shelter.position[axle]))
      .sort((a, b) => biggest ? b - a : a - b)
      .shift();
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
        center={[parseFloat(this.props.lat), parseFloat(this.props.lon)]}
        shelters={this.props.shelters}
        routes={this.props.routes}
        onSelectShelter={this.props.handleSelectShelter}
        bounds={this.state.bounds}
      />
    </div>);
  }
}

const mapStateToProps = state => {
  return state.Shelters;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchShelters: (lat, lon) => dispatch(fetchShelters(lat, lon)),
    fetchRouteToShelter: (from, to) => dispatch(fetchRouteToShelter(from, to)),
    handleSelectShelter: shelter => dispatch(selectShelter(shelter)),
    clearError: () => dispatch(clearError()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelters);
