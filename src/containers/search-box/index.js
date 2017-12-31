import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { autobind } from 'core-decorators';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import { route } from 'preact-router';

import { fetchAddressSuggestions } from './actions';
import Autocomplete from '../../components/autocomplete';

export class SearchBox extends Component {
  componentWillMount() {
    this.isMounted = true;

    this.debouncedSearchValue = new Subject();

    this.debouncedSearchValue
      .debounceTime(250)
      .takeWhile(() => this.isMounted)
      .subscribe(searchValue => this.props.fetchAddressSuggestions(searchValue));
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
    route(`/skyddsrum?lat=${address.lat}&lon=${address.lon}`, false);
  }

  render() {
    return (
      <Autocomplete
        suggestions={this.props.addressSuggestions}
        onChange={this.handleAddressChanged}
        onSelection={this.handleAddressSelection}
        value={this.state.searchValue}
      />
    );
  }
}

const mapStateToProps = state => {
  return state.SearchBox;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAddressSuggestions: query => dispatch(fetchAddressSuggestions(query)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBox);