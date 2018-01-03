import { h } from 'preact';
import classNames from 'classnames';
import style from './style.scss';

import Bouncer from '../bouncer';
import Suggestion from '../suggestion';

export default ({
  value,
  onChange,
  onSelection,
  suggestions,
  loading,
  styles,
}) => {
  return (
    <div class={classNames(style.searchBox, styles)}>
      <input
        type="text"
        placeholder="Var vill du söka från?"
        onInput={event => onChange(event.target.value)}
        value={value}
      />
      {!!loading && <Bouncer position="absolute" />}

      {suggestions &&
      <ul class={style.suggestions}>
        {suggestions.map(sugg =>
          <Suggestion suggestion={sugg} onClick={onSelection} />
        )}
      </ul>
      }
    </div>
  );
};
