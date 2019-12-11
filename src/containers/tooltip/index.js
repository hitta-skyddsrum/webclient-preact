import { connect } from 'react-redux';
import { hideTooltip } from './actions';
import Tooltip from '../../components/tooltip';

const mapStateToProps = ({ Tooltip }, { tooltipId }) => ({
  hidden: Tooltip[tooltipId] && Tooltip[tooltipId].hidden,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(hideTooltip(ownProps.tooltipId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tooltip);
