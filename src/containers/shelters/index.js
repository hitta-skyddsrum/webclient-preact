import { connect } from 'preact-redux';
import { fetchShelters, fetchRouteToShelter, selectShelter, unselectShelter, clearError } from './actions';

import SheltersComponent from '../../components/shelters';

const mapStateToProps = state => {
  return state.Shelters;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchShelters: (lat, lon) => dispatch(fetchShelters(lat, lon)),
    fetchRouteToShelter: (from, to) => dispatch(fetchRouteToShelter(from, to)),
    onSelectShelter: shelter => dispatch(selectShelter(shelter)),
    onUnselectShelter: () => dispatch(unselectShelter()),
    onCloseErrorDialog: () => dispatch(clearError()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SheltersComponent);
