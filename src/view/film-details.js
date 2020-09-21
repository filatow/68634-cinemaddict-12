import {formatFilmReleaseDate, formatCommentPostDate, formatFilmDuration} from "../utils/films";
import {createElement, replace} from "../utils/render";
import {isEscKeyPressed, isEnterKeyPressed, isCtrlKeyPressed} from "../utils/common";
import AbstractView from "./abstract";
import {ActionOnComment} from "../consts";
import {guid} from "../utils/common";

const Emoji = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`,
};

const createNewCommentTemplate = (newComment) => {
  let {comment, emotion} = newComment;

  let selectedEmojiImage = ``;
  let emojiSmileIsChecked = false;
  let emojiSleepingIsChecked = false;
  let emojiPukeIsChecked = false;
  let emojiAngryIsChecked = false;

  if (emotion !== null) {
    selectedEmojiImage = `<img src="images/emoji/${emotion}.png"
      width="55" height="55" alt="emoji-${emotion}">`;
    switch (emotion) {
      case Emoji.SMILE:
        emojiSmileIsChecked = true;
        break;
      case Emoji.SLEEPING:
        emojiSleepingIsChecked = true;
        break;
      case Emoji.PUKE:
        emojiPukeIsChecked = true;
        break;
      case Emoji.ANGRY:
        emojiAngryIsChecked = true;
        break;
    }
  }

  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">${selectedEmojiImage}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
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


const createFilmDetailsTemplate = (data) => {
  const {
    title, titleOriginal, poster, releaseDate,
    raiting, duration, fullDescription,
    genres, comments, director,
    writers, actors, country,
    ageLimitation, isWatchlisted, isWatched,
    isFavorite, newComment} = data;

  const filmReleaseDate = formatFilmReleaseDate(releaseDate);
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
  const filmRuntime = formatFilmDuration(duration);

  const filmComments = comments.map((comment) => {
    const author = comment.author;
    const message = comment.comment;
    const date = formatCommentPostDate(comment.date);
    const emojiSource = `images/emoji/${comment.emotion}.png`;
    const emojiName = comment.emotion;
    const commentId = comment.id;

    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emojiSource}" width="55" height="55" alt="emoji-${emojiName}">
      </span>
      <div>
        <p class="film-details__comment-text">${message}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete" data-comment-id="${commentId}">Delete</button>
        </p>
      </div>
    </li>`;
  }
  ).join(``);

  const commentsCount = data.comments.length;

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
                <td class="film-details__cell">${filmRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
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

export default class FilmDetails extends AbstractView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments.slice(); // комментарии данного фильма (не вся модель)
    this._data = FilmDetails.parseFilmToData(this._film, this._comments); // комментарии данного фильма (не вся модель)

    this._closeDetailsHandler = this._closeDetailsHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._viewingPopupHandler = this._viewingPopupHandler.bind(this);
    this._updateNewCommentElement = this._updateNewCommentElement.bind(this);
    this._newCommentEmojiChangeHandler = this._newCommentEmojiChangeHandler.bind(this);
    this._newCommentTextChangeHandler = this._newCommentTextChangeHandler.bind(this);
    this._readyToPostSwitchOffHandler = this._readyToPostSwitchOffHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
    this._setEditNewCommentHandlers();
    this._setDeleteCommentHandler(this._deleteButtonClickHandler);
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

  setViewingPopupHandler(callback) {
    this._callback.commentListModification = callback;
    document.addEventListener(`keydown`, this._viewingPopupHandler);
  }

  setClosePopupClickHandler(callback) {
    this._callback.closeDetails = callback;
    this.element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeDetailsHandler);
  }

  _setEditNewCommentHandlers() {
    this.element
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._newCommentEmojiChangeHandler);
    this.element
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._newCommentTextChangeHandler);
  }

  _updateNewCommentElement(updatedNewComment = this._data.newComment) {
    let prevElement = this.element.querySelector(`.film-details__new-comment`);
    const newCommentTemplate = createNewCommentTemplate(updatedNewComment);
    const newElement = createElement(newCommentTemplate);
    replace(newElement, prevElement);
    prevElement = null;
  }

  _newCommentEmojiChangeHandler(event) {
    if (event.target.classList.contains(`film-details__emoji-label`)) {
      this._data.newComment.emotion = event.target.previousElementSibling.value;
    } else if (event.target.parentElement.classList.contains(`film-details__emoji-label`)) {
      this._data.newComment.emotion = event.target.parentElement.previousElementSibling.value;
    } else {
      return;
    }

    this._updateNewCommentElement();
    this._setEditNewCommentHandlers();
  }

  _newCommentTextChangeHandler(event) {
    this._data.newComment.comment = event.target.value;

    this._updateNewCommentElement();
    this._setEditNewCommentHandlers();

    this.textArea = this.element.querySelector(`.film-details__comment-input`);
    this.textArea.focus();
    this.textArea.selectionStart = this.textArea.value.length;
  }

  _getTemplate() {
    return createFilmDetailsTemplate(this._data);
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

  _readyToPostSwitchOffHandler(event) {
    if (isCtrlKeyPressed(event)) {
      this._data.newComment.isReadyToPost = false;
      document.removeEventListener(`keyup`, this._readyToPostSwitchOffHandler);
    }
  }

  _viewingPopupHandler(event) {
    if (isEscKeyPressed(event)) {
      this._closeDetailsHandler(event);
    }

    if (isCtrlKeyPressed(event)) {
      this._data.newComment.isReadyToPost = true;
      document.addEventListener(`keyup`, this._readyToPostSwitchOffHandler);
    }

    if (isEnterKeyPressed(event) && this._data.newComment.isReadyToPost) {
      if (this._data.newComment.comment && this._data.newComment.emotion) {
        event.preventDefault();
        this._data.newComment.id = guid();
        this._data.newComment.date = new Date();
        this._callback.commentListModification(
            ActionOnComment.ADD,
            FilmDetails.parseDataToFilm(this._data),
            FilmDetails.parseDataToNewComment(this._data));

        document.removeEventListener(`keydown`, this._viewingPopupHandler);

        return;
      }
      this._closeDetailsHandler(event);
    }
  }

  _deleteButtonClickHandler(event) {
    event.preventDefault();
    event.target.removeEventListener(`click`, this._deleteButtonClickHandler); // есть ли смысл удалять этот обработчик?
    const deletedCommentId = event.target.dataset.commentId;
    const deletedComment = this._data.comments.find((comment) => {
      return comment.id === deletedCommentId;
    });
    this._data.comments = this._data.comments.filter((comment) => {
      return comment.id !== deletedCommentId;
    });
    this._callback.commentListModification(
        ActionOnComment.DELETE,
        FilmDetails.parseDataToFilm(this._data),
        deletedComment);
  }

  _setDeleteCommentHandler(callback) {
    this.element
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((elem) => {
        elem.addEventListener(`click`, callback);
      });
  }

  _emptifyNewCommentElement() {
    this._data.newComment = {
      comment: ``,
      emotion: null,
      isReadyToPost: false,
    };
    this._updateNewCommentElement();
    this._setEditNewCommentHandlers();
  }

  _closeDetailsHandler(event) {
    event.preventDefault();
    this._emptifyNewCommentElement();
    this._callback.closeDetails();

    document.removeEventListener(`keydown`, this._viewingPopupHandler);
  }

  static parseFilmToData(film, filmComments) {
    const data = Object.assign(
        {},
        film,
        {
          comments: filmComments
        },
        {
          newComment: {
            comment: ``,
            emotion: null,
            isReadyToPost: false,
          }
        }
    );

    return data;
  }

  static parseDataToFilm(dataForParsing) {
    let data = Object.assign({}, dataForParsing);

    const comment = data.newComment.comment;
    let emotion = data.newComment.emotion;

    let initialComments = [];
    if (comment && emotion) {
      initialComments = [data.newComment.id];
    }

    data = Object.assign(
        {},
        data,
        {
          comments: data.comments.reduce((accumulator, currentComment) => {
            accumulator.push(currentComment.id);
            return accumulator;
          }, initialComments)
        }
    );

    delete data.newComment;
    return data;
  }

  static parseDataToNewComment(dataForParsing) {
    let data = Object.assign({}, dataForParsing);

    const id = data.newComment.id;
    const author = `userName`;
    const comment = data.newComment.comment;
    const date = data.newComment.date;
    const emotion = data.newComment.emotion;

    return {
      id,
      author,
      comment,
      date,
      emotion
    };
  }
}
