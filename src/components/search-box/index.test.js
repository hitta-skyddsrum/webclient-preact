import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { route } from 'preact-router';
import AlgoliaPlaces from 'algolia-places-react';
import ErrorDialog from '../error-dialog';
import SearchBox from './';

describe('components/search-box', () => {
  const sandbox = sinon.createSandbox();
  let mockContainer;

  beforeEach(() => {
    sandbox.stub(SearchBox.prototype, 'setContainerRef');

    const addEventListener = sinon.spy();
    mockContainer = {
      querySelector: () => ({
        addEventListener,
      }),
    };

    SearchBox.prototype.containerRef = mockContainer;

    const getCurrentPosition = sinon.spy();
    Object.assign(navigator, {
      geolocation: {
        getCurrentPosition,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call onGeolocation upon clicking on pin icon', () => {
    sandbox.spy(SearchBox.prototype.containerRef, 'querySelector');
    const onGeolocation = sinon.spy();
    shallow(<SearchBox onGeolocation={onGeolocation} />);

    expect(mockContainer.querySelector).to.have.been.calledWith('.ap-icon-pin');
    expect(mockContainer.querySelector().addEventListener)
      .to.have.been.calledWith('click', onGeolocation);
  });

  describe('ErrorDialog', () => {
    it('should display an ErrorDialog upon state error truthy', () => {
      const context = shallow(<SearchBox />);
      const title = 'This is the title';
      const desc = 'Descriptionable description';

      expect(context.find(<ErrorDialog />).length).to.equal(0);

      context.setState({
        error: {
          title,
          desc,
        },
      });

      expect(context.find(<ErrorDialog title={title} desc={desc} />).length).to.equal(1);
    });

    it('should hide ErrorDialog upon calling onClose cb', () => {
      const context = shallow(<SearchBox />);
      context.setState({
        error: {},
      });
      context.find('ErrorDialog').attr('handleClose')();
      context.rerender();

      expect(context.find(<ErrorDialog />).length).to.equal(0);
    });
  });

  describe('AlgoliaPlaces', () => {
    it('should contain AlgoliaPlaces component', () => {
      const apiKey = 'api-123';
      const appId = 'app-no-1';
      process.env.ALGOLIA_API_KEY = apiKey;
      process.env.ALGOLIA_APP_ID = appId;
      const wrapper = shallow(<SearchBox />);

      const apComp = wrapper.find(AlgoliaPlaces);
      expect(apComp.length).to.equal(1);
      expect(apComp.attr('placeholder')).to.equal('Var vill du söka från?');
      expect(apComp.attr('options')).to.deep.include({
        language: 'sv',
        countries: ['se'],
        apiKey,
        appId,
      });
    });

    it('should update state upon AlgoliaPlaces onLimit event', () => {
      const context = shallow(<SearchBox />);

      try {
        context.find(AlgoliaPlaces).attr('onLimit')();
      } catch (e) {}

      expect(context.state('error')).to.eql({
        title: 'Adressförslagen kunde inte hämtas',
        desc: <div>Tjänsten är för tillfället överbelastad och kan därmed inte visa förslag utifrån din sökning. Vi rekommenderar att du istället besöker <a href="https://gisapp.msb.se/apps/kartportal/enkel-karta_skyddsrum/">MSB</a> för att hitta ditt närmaste skyddsrum.</div>,
      });
    });

    it('should throw an error, to be catched by Raven, upon AlgoliaPlaces onLimit event', () => {
      const context = shallow(<SearchBox />);

      expect(context.find(AlgoliaPlaces).attr('onLimit')).to.throw(Error, /Rate limit/);
    });

    it('should update state upon AlgoliaPlaces onError event', () => {
      const context = shallow(<SearchBox />);

      try {
        context.find(AlgoliaPlaces).attr('onError')();
      } catch (e) {}

      expect(context.state('error')).to.eql({
        title: 'Addressförslagen kunde inte hämtas',
        desc: <div>Tjänsten för att hämta addressförslag är för tillfället inte tillgänglig. Vi rekommenderar att du istället besöker <a href="https://gisapp.msb.se/apps/kartportal/enkel-karta_skyddsrum/">MSB</a> för att hitta ditt närmaste skyddsrum.</div>,
      });
    });

    it('should throw an error, to be catched by Raven, upon AlgoliaPlaces onError event', () => {
      const context = shallow(<SearchBox />);
      const error = new Error('This is bad');

      // eslint-disable-next-line max-nested-callbacks
      expect(() => context.find(AlgoliaPlaces).attr('onError')(error)).to.throw(Error, /This is bad/);
    });

    it('should call onBlur upon AlgoliaPlaces onBlur event', () => {
      const onBlur = sinon.spy();
      const mockEvent = new Event('blur');
      const wrapper = shallow(<SearchBox onBlur={onBlur} />);

      wrapper.find(AlgoliaPlaces).attr('onBlur')(mockEvent);

      expect(onBlur).to.have.been.calledWith(mockEvent);
    });

    it('should call onFocus upon AlgoliaPlaces onFocus event', () => {
      const onFocus = sinon.spy();
      const mockEvent = new Event('blur');
      const wrapper = shallow(<SearchBox onFocus={onFocus} />);

      wrapper.find(AlgoliaPlaces).attr('onFocus')(mockEvent);

      expect(onFocus).to.have.been.calledWith(mockEvent);
    });

    it('should change route upon address selection', () => {
      jest.mock('preact-router');

      const context = shallow(<SearchBox onSelectAddress={sinon.spy()} />);
      const algoliaPlaces = context.find(AlgoliaPlaces);
      const lat = 14.53;
      const lon = 15.54;
      algoliaPlaces.attr('onChange')({ suggestion: { latlng: { lat, lng: lon } }});

      expect(route).to.have.been.calledOnce;

      const args = route.args[0][0];

      expect(args).to.match(/\/skyddsrum/);
      expect(args).to.match(new RegExp(`lat=${lat}`));
      expect(args).to.match(new RegExp(`lon=${lon}`));

      jest.unmock('preact-router');
    });

    it('should disable input field and show custom value upon geoLoading', () => {
      const wrapper = shallow(<SearchBox geoLoading />);

      expect(wrapper.find(AlgoliaPlaces).attr('disabled')).to.equal(true);
      expect(wrapper.find(AlgoliaPlaces).attr('value')).to.contain('Hämtar');
    });
  });
});
