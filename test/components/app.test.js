import { h, render } from 'preact';
import { expect } from 'chai';

import App from '../../src/components/app';

describe('App', () => {
  let scratch;

  beforeAll( () => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch);
  });

  beforeEach( () => {
    scratch.innerHTML = '';
  });

  afterAll( () => {
    scratch.parentNode.removeChild(scratch);
    scratch = null;
  });


  describe('routing', () => {
    it('should render the homepage', () => {
      render(<App />, scratch);

      expect(scratch.innerHTML).to.contain('Hitta skyddsrum');
    });
  });
});
