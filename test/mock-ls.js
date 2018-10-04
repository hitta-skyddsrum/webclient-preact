import sinon from 'sinon';

export default () => {
  Object.defineProperty(global, '_localStorage', {
    value: {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
    },
  });
};
