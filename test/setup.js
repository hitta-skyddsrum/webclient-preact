import 'regenerator-runtime/runtime';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import assertJsx, { options } from 'preact-jsx-chai';
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-15';

// when checking VDOM assertions, don't compare functions, just nodes and attributes:
options.functions = false;

// activate the JSX assertion extension:
chai.use(assertJsx);

chai.use(sinonChai);

global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

Enzyme.configure({ adapter: new EnzymeAdapter() });
