import { h } from 'preact';
import { BottomSheet } from 'material-ui-bottom-sheet';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Helmet from 'preact-helmet';
import ClearIcon from 'material-ui-icons/Clear';

import style from './style.scss';

export default ({
  shelter = {},
  open,
  onClose,
  onLoadElem,
}) => {
  if (!shelter.shelterId) return <div />;

  const closeButton = (
    <Button variant="fab" onClick={onClose} className="close">
      <ClearIcon />
    </Button>
  );

  return (<BottomSheet
    onRequestClose={onClose}
    style={{ height: 'auto' }}
    bodyStyle={{ transform: 'none' }}
    action={closeButton}
    actionStyle={{
      position: 'absolute',
      top: '-28px',
      right: '16px',
      float: 'none',
      marginTop: 0,
      marginRight: 0,
      zIndex: 2,
    }}
    ref={onLoadElem}
    open={open}>
    {shelter.shelterId && (
      <div>
        <Helmet
          title={`Skyddsrum ${shelter.shelterId}`}
        />
        <List>
          <ListItem disabled>
            <h1 class={style.title}>Skyddsrum {shelter.shelterId}</h1>
          </ListItem>
          <ListItem disabled>
            <ListItemText primary={`Fastighetsbeteckning: ${shelter.estateId}`} />
          </ListItem>
          <ListItem disabled>
            <ListItemText primary={`Adress: ${shelter.address}, ${shelter.municipality}`} />
          </ListItem>
          <ListItem disabled>
            <ListItemText primary={`Antal luftrenare: ${shelter.airCleaners}`} />
          </ListItem>
          <ListItem disabled>
            <ListItemText primary={`Antal platser: ${shelter.slots}`} />
          </ListItem>
        </List>
      </div>
    )}
  </BottomSheet>);
};
