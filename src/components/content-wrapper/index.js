import { h } from 'preact';
import classNames  from 'classnames/bind';
import style from './style.scss';

export default ({ children, align }) => {
  const cx = classNames.bind(style);
  const className = cx([
    'container',
  ], {
    center: align === 'center',
  });

  return (
    <div class={className}>
      <div class={style.window}>
        { children }
      </div>
    </div>
  );
};
