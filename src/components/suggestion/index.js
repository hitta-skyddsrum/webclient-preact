import { h } from 'preact';

import style from './style.scss';

export default ({ suggestion, onClick }) => {
  const handleOnClick = () => onClick(suggestion);

  return (
    <li>
      <a
        onClick={handleOnClick}
        class={style.itemLink}
      >{suggestion.name} {suggestion.desc}</a>
    </li>
  );
};
