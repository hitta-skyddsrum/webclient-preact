import { h } from 'preact';
import { Fab } from '@rmwc/fab';
import '@rmwc/fab/styles';

import styles from './styles.scss';

export default ({
  children,
  isOpen,
  onClose,
}) => (
  <div className={[styles.Container, isOpen && styles.IsOpen].filter(c => !!c).join(' ')}>
    <Fab className={`${styles.CloseButton} close`} onClick={onClose}>
      <div>
        x
      </div>
    </Fab>
    {children}
  </div>
);
