import { connect } from 'preact-redux';
import { selectAddress } from '../shelters/actions';
import HomeComponent from '../../components/home';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    onSelectAddress: address => dispatch(selectAddress(address)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeComponent);
