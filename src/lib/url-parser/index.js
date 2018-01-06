export const getSearchParam = (search, param) => {
  const value = search.substring(1)
    .split('&')
    .filter(query => query.indexOf(`${param}=`) !== -1)
    .map(query => query.split('=').pop())
    .pop();

  return !!value && value;
};

export const getValueAfterSection = (pathname, section) => {
  const split = pathname.split(`/${section}/`);

  return split.length > 1
    && split.pop().split('/').shift();
};
