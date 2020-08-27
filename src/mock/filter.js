
const filmToFilterMap = (films) => {
  const all = films.length;
  let watchlist = 0;
  let history = 0;
  let favorites = 0;

  for (const film of films) {
    if (film.isWatchlisted) {
      watchlist++;
    }
    if (film.isWatched) {
      history++;
    }
    if (film.isFavorite) {
      favorites++;
    }
  }

  return ({
    all,
    watchlist,
    history,
    favorites,
  });
};

export const generateFilter = (films) => {
  return (
    Object.entries(filmToFilterMap(films)).map(([filterName, filmsAmount]) => {
      return {
        name: filterName,
        count: filmsAmount,
      };
    })
  );
};
