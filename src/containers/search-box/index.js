import { connect } from 'preact-redux';
import {
  getCurrentPosition,
  rateLimitExceeded,
  searchError,
  selectAddress,
} from './actions';
import SearchBox from '../../components/search-box';

const mapStateToProps = ({ SearchBox }) => ({
  loadingGeo: SearchBox.loadingGeo,
});

const mapDispatchToProps = dispatch => ({
  onGeolocation: () => dispatch(getCurrentPosition()),
  onRateLimit: () => dispatch(rateLimitExceeded()),
  onSearchError: error => dispatch(searchError(error)),
  onSelectAddress: address => dispatch(selectAddress(address)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBox);
