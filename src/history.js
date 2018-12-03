import browserHistory from 'history/createBrowserHistory';

const history = browserHistory();

history.listen(location => {
  gtag && gtag('config', GA_TRACKING_ID, {'page_path': location.pathname + location.search});
});

export default history;
