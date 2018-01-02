import { connect } from 'preact-redux';
import { fetchShelters, fetchRouteToShelter, selectShelter, unselectShelter, clearError, fetchSingleShelter } from './actions';

import SheltersComponent from '../../components/shelters';

const mapStateToProps = state => {
  return state.Shelters;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleShelter: id => dispatch(fetchSingleShelter(id)),
    fetchShelters: (lat, lon) => dispatch(fetchShelters(lat, lon)),
    fetchRouteToShelter: (from, to) => dispatch(fetchRouteToShelter(from, to)),
    handleSelectShelter: shelter => dispatch(selectShelter(shelter)),
    handleUnselectShelter: () => dispatch(unselectShelter()),
    clearError: () => dispatch(clearError()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SheltersComponent);
