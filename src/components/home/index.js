import { h } from 'preact';
import ContentContainer from '../content-wrapper';
import SearchBox from '../search-box';

export default () => {
  return (
    <ContentContainer size="wide" align="center">
      <h1>Hitta skyddsrum</h1>
      <p>Vi hjälper dig att hitta ditt närmaste skyddsrum. Så att du vet vart du ska ta vägen när det verkligen
        behövs.</p>
      <SearchBox />
    </ContentContainer>
  );
};
