import { Component, h } from 'preact';
import Button from '../button';
import styles from './style.scss';

export default class UpdateAvailable extends Component {
  state = {
    isHidden: false,
    shouldHide: false,
  };

  constructor(props) {
    super(props);
 
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleClickInstall = this.handleClickInstall.bind(this);
  }

  handleClickClose() {
    this.setState({
      shouldHide: true,
    });

    setTimeout(() => {
      this.setState({
        isHidden: true,
      });
    }, 500);
  }

  handleClickInstall() {
    window.location.reload();
  }

  render() {
    if (this.state.isHidden) {
      return null;
    }

    const classNames = [styles.container]
      .concat(this.state.shouldHide && styles.hide)
      .filter(cn => !!cn)
      .join(' ');

    return (
      <div className={classNames}>
        <p>Det finns en uppdatering tillgänglig.</p>
        <p>Ladda om sidan för att använda den senaste versionen.</p>
        <Button
          onClick={this.handleClickInstall}
          role="reload"
        >
          Ladda om
        </Button>
        <Button
          onClick={this.handleClickClose}
          type="secondary"
          role="close"
        >
          Stäng
        </Button>
      </div>
    );
  }
}

