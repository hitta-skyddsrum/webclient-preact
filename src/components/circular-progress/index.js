import { h } from 'preact';
import styles from './styles.scss';

export default () => {
  const size = 48;

  return (
    <div className={styles.CircularProgress}>
      <svg className={styles.Circle} viewBox={`0 0 ${size}`}>
        <circle
          className={styles.Path}
          cx={size / 2}
          cy={size / 2}
          r={size / 2.4}
        />
      </svg>
    </div>
  );
};
