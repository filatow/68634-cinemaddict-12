const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.isWatchlisted).length,
  history: (films) => films.filter((film) => film.isWatched).length,
  favorites: (films) => films.filter((film) => film.isFavorite).length,
};

export const generateFilter = (films) => {
  return (
    Object.entries(filmToFilterMap).map(([filterName, countFilm]) => {
      return {
        name: filterName,
        count: countFilm(films),
      };
    })
  );
};
