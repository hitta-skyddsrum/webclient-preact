import { h } from 'preact';
import styles from './style.scss';

const today = new Date();

export default ({
  expires = new Date(),
  hidden = false,
  onClick,
  title,
}) => !hidden && (today <= expires) && (
  <div className={styles.tooltip} onClick={onClick}>
    <span className={styles.header}>Nyhet!</span>
    <div>{title}</div>

    <div className={styles.arrow} />
  </div>
);
