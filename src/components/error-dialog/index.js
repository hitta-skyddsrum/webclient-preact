import { h, Component } from 'preact';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/Dialog/style.css';

import styles from './styles.scss';

export default class ErrorDialog extends Component {
  componentDidMount() {
    this.props.show && this.dialogRef.MDComponent.open();
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.dialogRef.MDComponent.open();
    }

    if (!this.props.show && prevProps.show) {
      this.dialogRef.MDComponent.close();
    }
  }

  setDialogRef = (ref) => {
    this.dialogRef = ref;
  };

  render() {
    return (
      <Dialog
        modal={false}
        open={this.props.show}
        onCancel={this.props.onClose}
        ref={this.setDialogRef}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`error-dialog ${styles.errorDialog}`}
      >
        <Dialog.Header>{this.props.title}</Dialog.Header>

        <Dialog.Body>
          {this.props.desc}
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.FooterButton
            accept
            onClick={this.props.onClose}
          >Okej</Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
