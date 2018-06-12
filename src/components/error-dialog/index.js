import { h, Component } from 'preact';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

export default class ErrorDialog extends Component {
  render() {
    return (
      <Dialog
        modal={false}
        open={true}
        onClose={this.props.handleClose}
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
            onClick={this.props.handleClose}
          >Okej</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
