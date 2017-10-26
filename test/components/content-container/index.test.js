import { h } from 'preact';
import { expect } from 'chai';

import ContentContainer from '../../../src/components/content-container';

describe('components/ContentContainer', () => {

  it('should render its children', () => {
    const content = <div>here we are</div>;
    const container = <ContentContainer> {content} </ContentContainer>;
    expect(container).to.contain(content);
  });

  it('should apply the `center` class when align is assigned `center`', () => {
    const container = <ContentContainer align="center" />;

    expect(container).to.contain('center');
  });

});
