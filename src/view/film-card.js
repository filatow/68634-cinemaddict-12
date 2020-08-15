export const createFilmCardTemplate = (film) => {
  const {
    title, poster, productionYear,
    raiting, duration, description,
    genres, comments, isWatchlisted,
    isWatched, isFavorite} = film;
  const commentsInfo = comments.length !== 1
    ? comments.length + ` comments`
    : comments.length + ` comment`;
  const descriptionShortened = description.length > 140
    ? description.slice(0, 140) + `...`
    : description;
  const watchlistClassName = isWatchlisted
    ? `film-card__controls-item--active`
    : ``;
  const watchedClassName = isWatched
    ? `film-card__controls-item--active`
    : ``;
  const favoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${raiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${productionYear}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="${title}" class="film-card__poster">
    <p class="film-card__description">${descriptionShortened}</p>
    <a class="film-card__comments">${commentsInfo}</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
    </form>
  </article>`
  );
};
