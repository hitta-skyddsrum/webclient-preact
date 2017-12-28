import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import { route } from 'preact-router';

import Redirect from './';

describe('containers/redirect', () => {
  beforeEach(() => {
    jest.mock('preact-router');
  });

  afterEach(() => {
    jest.unmock('preact-router');
  });

  it('should redirect and keep path parameters', () => {
    const matches = {
      id: 1,
      name: 'Adolf',
    };
    const to = ':name/:id';

    shallow(<Redirect matches={matches} to={to} />);

    expect(route).to.have.been.calledWith(`/${matches.name}/${matches.id}`, true);
  });
});
