import { h } from 'preact';
import classNames  from 'classnames/bind';
import style from './style.scss';

const ContentContainer = ({ children, align }) => {
  const cx = classNames.bind(style);
  const className = cx([
    'container',
  ], {
    center: align === 'center',
  });

  return (
    <div class={className}>
      <div class="window">
        { children }
      </div>
    </div>
  );
};

export default ContentContainer;
