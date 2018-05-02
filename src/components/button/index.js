import { h } from 'preact';
import Classnames from 'classnames/bind';
import style from './style.scss';

export default ({
  children,
  type = 'primary',
}) => {
  const cx = Classnames.bind(style);
  const className = cx(['button', type]);

  return (
    <div class={className}>{children}</div>
  );
};
