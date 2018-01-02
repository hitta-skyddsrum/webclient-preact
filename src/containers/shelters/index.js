import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { autobind } from 'core-decorators';

import { fetchShelters, fetchRouteToShelter, selectShelter, clearError, fetchSingleShelter } from './actions';
import SheltersMap from '../../components/shelters-map';
import ErrorDialog from '../../components/error-dialog';
import LoadingIndicator from '../../components/loading-indicator';
import ShelterDetail from '../../components/shelter-detail';

export class Shelters extends Component {
  state = {
    hideShelterDetail: true,
  };

  componentWillMount() {
    if (this.props.id) {
      this.fetchAndSelectShelter(this.props.id);
    } else {
      this.props.fetchShelters(this.props.lat, this.props.lon);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
      const shelter = this.props.shelters.find(({ id }) => parseInt(nextProps.id, 10) === id);

      if (!shelter) {
        this.fetchAndSelectShelter(nextProps.id);
      } else {
        this.props.handleSelectShelter(shelter);
      }
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

  fetchAndSelectShelter(id) {
    this.props.fetchSingleShelter(id)
      .then(({ shelter }) => this.props.handleSelectShelter(shelter));
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
  handleSelectShelter(shelter) {
    let url = `/skyddsrum/${shelter.id}`;

    const { lat, lon } = this.props;

    if (lat && lon) {
      const searchParams = new URLSearchParams();
      const position = { lat, lon };
      Object.keys(position).forEach(key => searchParams.append(key, position[key]));

      url += `?${searchParams.toString()}`;
    }

    route(url, false);
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
        onSelectShelter={this.handleSelectShelter}
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
    clearError: () => dispatch(clearError()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelters);
