import { h, Component } from 'preact';
import { Dialog, DialogActions, DialogButton, DialogContent, DialogTitle } from '@rmwc/dialog';
import '@rmwc/dialog/styles';

import styles from './styles.scss';

export default class ErrorDialog extends Component {
  render() {
    return (
      <Dialog
        modal={false}
        open={this.props.show}
        onCancel={this.props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`error-dialog ${styles.errorDialog}`}
      >
        <DialogTitle>{this.props.title}</DialogTitle>

        <DialogContent>
          {this.props.desc}
        </DialogContent>

        <DialogActions>
          <DialogButton
            accept
            onClick={this.props.onClose}
          >Okej</DialogButton>
        </DialogActions>
      </Dialog>
    );
  }
}
