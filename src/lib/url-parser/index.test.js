import { expect } from 'chai';

import { getSearchParam, getValueAfterSection } from './';

describe('lib/url-parser/getSearchParam', () => {
  it('should return false when an empty search param is given', () => {
    expect(getSearchParam('', 'idontexist')).to.be.false;
  });

  it('should return false when the param isn\'t found', () => {
    expect(getSearchParam('?hey=baberiba', 'findme')).to.be.false;
  });

  it('should return accurate value', () => {
    const param = 'idoexist';
    const value = 'ofCourse';

    expect(getSearchParam(`?${param}=${value}`, param)).to.equal(value);
  });
});

describe('lib/url-parser/getValueAfterSection', () => {
  it('should return false when section isn\'t found', () => {
    expect(getValueAfterSection('/path/deep', 'findmenow')).to.be.false;
  });

  it('should return accurate value', () => {
    const section = 'what';
    const value = 'im';

    expect(getValueAfterSection(`/path/with/${section}/${value}/looking/for`, section)).to.equal(value);
  });
});
