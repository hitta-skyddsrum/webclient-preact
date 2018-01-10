import { h } from 'preact';
import { BottomSheet } from 'material-ui-bottom-sheet';
import { List, ListItem, Subheader, FloatingActionButton } from 'material-ui';
import Helmet from 'preact-helmet';
import ClearIcon from 'material-ui/svg-icons/content/clear';

export default ({ shelter = {}, open, onClose }) => {
  const closeButton = <FloatingActionButton onClick={onClose}>
    <ClearIcon />
  </FloatingActionButton>;

  return (<BottomSheet
    onRequestClose={onClose}
    style={{ height: 'auto' }}
    action={closeButton}
    open={open}>
    {shelter.shelterId && <Helmet
      title={`Skyddsrum ${shelter.shelterId}`}
    />}
    <Subheader><h1>Skyddsrum {shelter.shelterId}</h1></Subheader>
    <List>
      <ListItem disabled primaryText={`Fastighetsbeteckning: ${shelter.estateId}`} />
      <ListItem disabled primaryText={`Adress: ${shelter.address}, ${shelter.municipality}`} />
      <ListItem disabled primaryText={`Antal luftrenare: ${shelter.airCleaners}`} />
      <ListItem disabled primaryText={`Antal platser: ${shelter.slots}`} />
    </List>
  </BottomSheet>);
};
