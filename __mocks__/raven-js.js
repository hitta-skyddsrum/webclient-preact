import sinon from 'sinon';

module.exports = {
  captureBreadcrumb: sinon.spy(),
  captureException: sinon.spy(),
  config: sinon.stub().returns({ install: sinon.spy() }),
  setDataCallback: sinon.spy(),
};
