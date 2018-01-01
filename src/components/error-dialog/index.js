import { h, Component } from 'preact';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class Notifier extends Component {
  render() {
    const actions = [
      <FlatButton
        label="Okej"
        primary={true}
        onClick={this.props.handleClose}
      />,
    ];

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={false}
        open={true}
        onRequestClose={this.props.handleClose}
      >
        {this.props.desc}
      </Dialog>
    );
  }
}
