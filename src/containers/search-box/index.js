import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { autobind } from 'core-decorators';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import { route } from 'preact-router';

import { fetchShelters } from '../shelters/actions';
import { fetchSuggestions, selectAddress, reverseGeocode } from './actions';
import Autocomplete from '../../components/autocomplete';

export class SearchBox extends Component {
  componentWillMount() {
    this.props.onMount(this.props.lat, this.props.lon);

    this.isMounted = true;

    this.debouncedSearchValue = new Subject();
    this.debouncedSearchValue
      .debounceTime(250)
      .takeWhile(() => this.isMounted)
      .subscribe(searchValue => this.props.onSearchValueChange(searchValue));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.selectedAddress && !this.props.selectedAddress) {
      this.setState({ searchValue: nextProps.selectedAddress.name });
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  @autobind
  handleAddressChanged(searchValue) {
    this.setState({ searchValue });
    this.debouncedSearchValue.next(searchValue);
  }

  @autobind
  handleAddressSelection(address) {
    this.setState({
      searchValue: address.name,
    });
    this.props.onSelectAddress(address);
    route(`/skyddsrum?lat=${address.lat}&lon=${address.lon}`, false);
  }

  render() {
    return (
      <Autocomplete
        suggestions={this.props.suggestions}
        onChange={this.handleAddressChanged}
        onSelection={this.handleAddressSelection}
        value={this.state.searchValue}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return state.SearchBox;
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: (lat, lon) => dispatch(reverseGeocode(lat, lon))
      .then(({ address }) => dispatch(selectAddress(address))),
    onSearchValueChange: query => dispatch(fetchSuggestions(query)),
    onSelectAddress: address => {
      dispatch(selectAddress(address));
      dispatch(fetchShelters(address.lat, address.lon));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBox);
