import { h } from 'preact';
import style from './style.scss';

import Suggestion from '../suggestion';

export default ({
  value,
  onChange,
  onSelection,
  suggestions,
}) => {
  return (
    <div class={style.searchBox}>
      <input
        type="text"
        placeholder="Var vill du söka från?"
        onInput={event => onChange(event.target.value)}
        value={value}
      />

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
