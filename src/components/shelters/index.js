import { h, Component } from 'preact';
import { route } from 'preact-router';
import { autobind } from 'core-decorators';

import SheltersMap from '../shelters-map';
import ErrorDialog from '../error-dialog';
import LoadingIndicator from '../loading-indicator';
import ShelterDetail from '../shelter-detail';
import SearchBox from '../../containers/search-box';

import style from './style.scss';

export default class Shelters extends Component {
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
      this.props.handleUnselectShelter();
    }

    if (nextProps.id && nextProps.id !== this.props.id) {
      this.props.handleSelectShelter(nextProps.id);
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
      <SearchBox styles={style.searchBox} />
      <SheltersMap
        center={[this.props.lat, this.props.lon]}
        shelters={this.props.shelters}
        routes={this.props.routes}
        onSelectShelter={this.handleClickShelter}
        bounds={this.props.bounds}
      />
      {this.props.selectedShelter && <ShelterDetail
        open={!this.state.hideShelterDetail}
        shelter={this.props.selectedShelter}
        onClose={this.handleCloseShelterDetail}
      />}
    </div>);
  }
}
