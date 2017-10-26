import { h } from 'preact';
import Classnames from 'classnames/bind';
import style from './style.scss';

export default ({ children }) => {
  const cx = Classnames.bind(style);
  const className = cx(['button']);

  return (
    <div class={className}>{children}</div>
  );
};
