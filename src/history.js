import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen(location => {
  gtag && gtag('config', GA_TRACKING_ID, {'page_path': location.pathname + location.search});
});

export default history;
