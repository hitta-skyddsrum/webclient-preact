import { connect } from 'preact-redux';
import { fetchShelters, fetchRouteToShelter, selectShelter, unselectShelter, clearError } from './actions';

import SheltersComponent from '../../components/shelters';

const mapStateToProps = state => {
  return state.Shelters;
};

const mapDispatchToProps = dispatch => {
  return {
    fetchShelters: position => dispatch(fetchShelters(position[0], position[1])),
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
