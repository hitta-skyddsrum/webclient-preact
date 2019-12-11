import { connect } from 'react-redux';
import { CLEAR_ERROR } from './types';

import ErrorDialog from '../../components/error-dialog';

const mapStateToProps = ({ ErrorDialog }) => ({
  title: ErrorDialog.title,
  desc: ErrorDialog.desc,
  show: !!ErrorDialog.title || !!ErrorDialog.desc,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch({
    type: CLEAR_ERROR,
  }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorDialog);
