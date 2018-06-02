import { h } from 'preact';
import styles from './style.scss';

export default ({
  children,
  onClose,
}) => (
  <div className={styles.mapNotification} onClick={onClose}>
    <div className={styles.inner}>
      {children}
    </div>
  </div>
);
