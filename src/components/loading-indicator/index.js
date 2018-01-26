import { h } from 'preact';
import { CircularProgress } from 'material-ui/Progress';

import styles from './style.scss';

export default ({ message }) => {
  return (
    <div class={styles.overlay}>
      <div class={styles.loadingBox}>
        <CircularProgress />
        {!!message && <h3>{message}</h3>}
      </div>
    </div>
  );
};
