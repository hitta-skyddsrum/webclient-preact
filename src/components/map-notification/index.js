import { h } from 'preact';
import styles from './style.scss';

export default ({
  children,
}) => (
  <div className={styles.mapNotification}>
    <div className={styles.inner}>
      {children}
    </div>
  </div>
);
