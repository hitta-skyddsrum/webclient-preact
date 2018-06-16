import { connect } from 'preact-redux';
import {
  getCurrentPosition,
  selectAddress,
} from './actions';
import SearchBox from '../../components/search-box';

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  onGeolocation: () => dispatch(getCurrentPosition()),
  onSelectAddress: address => dispatch(selectAddress(address)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBox);
