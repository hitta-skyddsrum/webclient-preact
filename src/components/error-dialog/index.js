import { h, Component } from 'preact';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

export default class ErrorDialog extends Component {
  render() {
    return (
      <Dialog
        modal={false}
        open={this.props.show}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="error-dialog"
      >
        <DialogTitle>{this.props.title}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            {this.props.desc}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={this.props.onClose}
          >Okej</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
