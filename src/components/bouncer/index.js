import { h } from 'preact';
import Classnames from 'classnames';
import style from './style.scss';

export default () => {
  const cx = Classnames.bind(style);
  const className = cx([
    'bouncer',
  ]);

  return (
    <div class={className}>
      <div class="bounce1" />
      <div class="bounce2" />
      <div class="bounce3" />
    </div>
  );
};
