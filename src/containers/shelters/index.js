import { connect } from 'preact-redux';
import {
  fetchShelters,
  fetchRouteToShelter,
  reverseGeocode,
  selectAddress,
  selectShelter,
  unselectShelter,
  clearError,
} from './actions';

import SheltersComponent from '../../components/shelters';

const mapStateToProps = state => {
  return state.Shelters;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchShelters: position => dispatch(fetchShelters(position[0], position[1])),
    fetchRouteToShelter: (from, to) => dispatch(fetchRouteToShelter(from, to)),
    onSelectAddress: suggestion => dispatch(selectAddress(suggestion)),
    onSelectShelter: shelter => dispatch(selectShelter(shelter)),
    onUnselectShelter: () => dispatch(unselectShelter()),
    onCloseErrorDialog: () => dispatch(clearError()),
    reverseGeocode: position => dispatch(reverseGeocode(position[0], position[1])),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SheltersComponent);
