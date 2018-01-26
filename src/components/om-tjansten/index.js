import { h } from 'preact';

import ContentWrapper from '../content-wrapper';

export default () => {
  return (
    <ContentWrapper>
      <h1>Om tjänsten</h1>

      <p>Hitta skyddsrum är en inofficiell webbtjänst baserad på <a href="https://www.msb.se/sv/Produkter--tjanster/Karttjanster/Inspiredirektivet/MSBs-Inspiretjanster/" target="_blank">data från MSB</a> . Databasen innehåller samtliga Sveriges skyddsrum.</p>

      <p><em>Senaste data-import: 19 oktober 2016</em></p>

      <p>Om du har synpunkter, frågor eller funderingar, kontakta oss på <a href="mailto:admin@hittaskyddsrum.se">admin@hittaskyddsrum.se</a>.</p>
    </ContentWrapper>
  );
};
