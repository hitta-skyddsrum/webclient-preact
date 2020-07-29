import 'regenerator-runtime/runtime';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import assertJsx, { options } from 'preact-jsx-chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });

// when checking VDOM assertions, don't compare functions, just nodes and attributes:
options.functions = false;

// activate the JSX assertion extension:
chai.use(assertJsx);

chai.use(sinonChai);

global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
