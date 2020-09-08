import {humanizeFilmReleaseDate, humanizeCommentPostDate} from "../utils/films";
import {renderTemplate, RenderPosition} from "../utils/render";
import AbstractView from "./abstract";

const createNewCommentTemplate = (newComment) => {
  let {text, selectedEmojiImage, checkedEmojiOption} = newComment;

  let emojiSmileIsChecked = false;
  let emojiSleepingIsChecked = false;
  let emojiPukeIsChecked = false;
  let emojiAngryIsChecked = false;

  switch (checkedEmojiOption) {
    case `smile`:
      emojiSmileIsChecked = true;
      selectedEmojiImage = `<img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">`;
      break;
    case `sleeping`:
      emojiSleepingIsChecked = true;
      selectedEmojiImage = `<img src="images/emoji/sleeping.png" width="55" height="55" alt="emoji-sleeping">`;
      break;
    case `puke`:
      emojiPukeIsChecked = true;
      selectedEmojiImage = `<img src="images/emoji/puke.png" width="55" height="55" alt="emoji-puke">`;
      break;
    case `angry`:
      emojiAngryIsChecked = true;
      selectedEmojiImage = `<img src="images/emoji/angry.png" width="55" height="55" alt="emoji-angry">`;
      break;
  }

  return (`
    <div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">${selectedEmojiImage}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji"
        type="radio" id="emoji-smile" value="smile" ${emojiSmileIsChecked ? `checked` : ``}>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji"
        type="radio" id="emoji-sleeping" value="sleeping" ${emojiSleepingIsChecked ? `checked` : ``}>
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji"
        type="radio" id="emoji-puke" value="puke" ${emojiPukeIsChecked ? `checked` : ``}>
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji"
        type="radio" id="emoji-angry" value="angry" ${emojiAngryIsChecked ? `checked` : ``}>
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>`);
};


const createFilmDetailsTemplate = (film, newComment) => {
  const {
    title, titleOriginal, poster, releaseDate,
    raiting, duration, fullDescription,
    genres, comments, director,
    writers, actors, country,
    ageLimitation, isWatchlisted, isWatched,
    isFavorite} = film;

  const filmReleaseDate = humanizeFilmReleaseDate(releaseDate);
  const filmGenres = genres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join(` `);
  const watchlistCheckboxState = isWatchlisted
    ? `checked`
    : ``;
  const watchedCheckboxState = isWatched
    ? `checked`
    : ``;
  const favoriteCheckboxState = isFavorite
    ? `checked`
    : ``;
  const filmWriters = writers.join(`, `);
  const filmActors = actors.join(`, `);

  const filmComments = comments.map((comment) => {
    const emojiSource = comment.emoji;
    const re = /images\/emoji\/|\\.png/;
    const emojiName = emojiSource.replace(re, ``);
    const message = comment.message;
    const author = comment.author;
    const date = humanizeCommentPostDate(comment.date);

    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emojiSource}" width="55" height="55" alt="emoji-${emojiName}">
      </span>
      <div>
        <p class="film-details__comment-text">${message}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }
  ).join(``);

  const commentsCount = film.comments.length;

  const newCommentTemplate = createNewCommentTemplate(newComment);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${title}">

            <p class="film-details__age">${ageLimitation}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${raiting}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${filmReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${filmGenres}
                  </td>
              </tr>
            </table>

            <p class="film-details__film-description">
            ${fullDescription}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistCheckboxState}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedCheckboxState}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteCheckboxState}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${filmComments}
          </ul>

          ${newCommentTemplate}
        </section>
      </div>
    </form>
  </section>`
  );
};

export default class FilmsDertails extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._newCommentData = {
      text: ``,
      checkedEmojiOption: null,
      selectedEmojiImage: ``,
    };
    this._enableNewCommentWatcher();

    this._closeDetailsClickHandler = this._closeDetailsClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  setCloseDetailsClickHandler(callback) {
    this._callback.closeDetailsClick = callback;
    this.element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeDetailsClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClickHandler = callback;
    this.element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClickHandler = callback;
    this.element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClickHandler = callback;
    this.element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  _getTemplate() {
    return createFilmDetailsTemplate(this._film, this._newCommentData);
  }

  _closeDetailsClickHandler(event) {
    event.preventDefault();
    this._callback.closeDetailsClick(this._film);
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

  _enableNewCommentWatcher() {

    const setEditNewCommentHandlers = () => {
      this.element
        .querySelector(`.film-details__emoji-list`)
        .addEventListener(`click`, emojiChangeHandler);
      this.element
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`input`, textChangeHandler);
    };

    const updateNewCommentElement = () => {
      this.element.querySelector(`.film-details__new-comment`).remove();
      const newCommentTemplate = createNewCommentTemplate(this._newCommentData);
      renderTemplate(
          this.element.querySelector(`.film-details__comments-wrap`), newCommentTemplate, RenderPosition.BEFOREEND);
      setEditNewCommentHandlers();
    };

    const emojiChangeHandler = (event) => {
      switch (event.target.tagName) {
        case `IMG`:
          this._newCommentData.checkedEmojiOption = event.target.parentElement.previousElementSibling.value;
          break;
        case `LABEL`:
          this._newCommentData.checkedEmojiOption = event.target.previousElementSibling.value;
          break;
        default:
          return;
      }

      updateNewCommentElement();
    };

    const textChangeHandler = (event) => {
      this._newCommentData.text = event.target.value;

      updateNewCommentElement();

      const textArea = this.element.querySelector(`.film-details__comment-input`);
      textArea.focus();
      textArea.selectionStart = textArea.value.length;
    };

    setEditNewCommentHandlers();
  }

}
