import { connect } from 'preact-redux';
import { fetchSuggestions } from './actions';
import SearchBox from '../../components/search-box';

const mapStateToProps = state => {
  return state.SearchBox;
};

const mapDispatchToProps = dispatch => {
  return {
    onSearchValueChange: query => dispatch(fetchSuggestions(query)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBox);
