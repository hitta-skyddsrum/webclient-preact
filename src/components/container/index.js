import { h, Component } from 'preact';
import style from './style.scss';

export default class ContentContainer extends Component {
  render() {
    return (
      <div class={style.container}>
        <div class="window">
          { this.props.children }
        </div>
      </div>
    );
  }
}
