export default () => !!navigator.userAgent.match(/Trident.*rv:11\./) || window.navigator.userAgent.indexOf('MSIE') > -1;

