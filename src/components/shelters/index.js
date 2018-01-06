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
  static defaultProps = {
    youAreHere: [],
  };

  state = {
    hideShelterDetail: false,
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
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.selectedShelterId !== this.props.selectedShelterId) {
      if (nextProps.selectedShelterId) {
        this.props.onSelectShelter(nextProps.selectedShelterId);
      } else {
        this.props.onUnselectShelter();
        this.props.fetchShelters(this.props.youAreHere);
      }
    }

    if (nextProps.selectedShelter && nextProps.selectedShelter !== this.props.selectedShelter) {
      this.setState({ hideShelterDetail: false });
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
        handleClose={this.props.onCloseErrorDialog}
      />}
      <SearchBox styles={style.searchBox} />
      <SheltersMap
        center={this.state.center}
        youAreHere={this.props.youAreHere}
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
