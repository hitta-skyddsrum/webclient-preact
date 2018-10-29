import { h } from 'preact';
import Fab from 'preact-material-components/Fab';
import 'preact-material-components/Fab/style.css';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Icon/style.css';

import styles from './styles.scss';

export default ({
  children,
  isOpen,
  onClose,
}) => (
  <div className={[styles.Container, isOpen && styles.IsOpen].filter(c => !!c).join(' ')}>
    <Fab className={`${styles.CloseButton} close`} onClick={onClose}>
      <Icon>clear</Icon>
    </Fab>
    {children}
  </div>
);