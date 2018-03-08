import { h } from 'preact';
import Helmet from 'preact-helmet';
import ContentWrapper from '../content-wrapper';

export default () => {
  return (
    <ContentWrapper>
      <Helmet
        title="Sidan kunde inte hittas"
        meta={[
          { name: 'robots', content: 'noindex' },
        ]}
      />

      <h1>Sidan kunde inte hittas</h1>

      <p>Om du söker ett skyddsrum, <a href="/">gå till startsidan</a>
          &nbsp;och sök efter det därifrån.</p>

      <p>Meddela oss gärna via <a href="mailto:admin@hittaskyddsrum.se">admin@hittskyddsrum.se</a>
          &nbsp;och och berätta hur du hamnade här.</p>
    </ContentWrapper>
  );
};
