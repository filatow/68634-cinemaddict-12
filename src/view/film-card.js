import AbstractView from "./abstract";

const createFilmCardTemplate = (film) => {
  const {
    title, poster, releaseDate,
    raiting, duration, shortDescription,
    genres, comments, isWatchlisted,
    isWatched, isFavorite} = film;
  const commentsInfo = comments.length !== 1
    ? comments.length + ` comments`
    : comments.length + ` comment`;
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
      <span class="film-card__year">${releaseDate.getFullYear()}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="${title}" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${commentsInfo}</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class FilmsCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._toDetailsClickHandler = this._toDetailsClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  setToDetailsClickHandler(callback) {
    this._callback.toDetailsClick = callback;
    this.element.querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
    .forEach((elem) => {
      elem.addEventListener(`click`, this._toDetailsClickHandler);
    });
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClickHandler = callback;
    this.element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClickHandler = callback;
    this.element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClickHandler = callback;
    this.element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  _getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _toDetailsClickHandler(event) {
    if (event.target.classList.contains(`film-card__comments`)) {
      event.preventDefault();
    }

    this._callback.toDetailsClick();
  }

  _favoriteClickHandler(event) {
    event.preventDefault();
    this._callback.favoriteClickHandler();
  }

  _watchedClickHandler(event) {
    event.preventDefault();
    this._callback.watchedClickHandler();
  }

  _watchlistClickHandler(event) {
    event.preventDefault();
    this._callback.watchlistClickHandler();
  }
}
