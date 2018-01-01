import { h } from 'preact';
import Classnames from 'classnames';
import style from './style.scss';

export default ({ position }) => {
  const cx = Classnames.bind(style);
  const className = cx([
    style.bouncer,
    style[position],
  ]);

  return (
    <div class={className}>
      <div />
      <div class={style.bounce2} />
      <div />
    </div>
  );
};
