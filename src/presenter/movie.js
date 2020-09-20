import FilmCardView from "../view/film-card";
import FilmDetailsView from "../view/film-details";
import {render, replace, remove, RenderPosition} from "../utils/render";
// import {ActionOnComment} from "../consts";
import {ActionOnMovie, UpdateType} from "../consts";

const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILED: `DETAILED`
};

export default class Movie {
  constructor(filmListContainer, changeFilmData, changeViewMode, commentsModel) {
    this._filmListContainer = filmListContainer;
    this._changeFilmData = changeFilmData;
    this._changeViewMode = changeViewMode;
    this._commentsModel = commentsModel;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleToDetailsClick = this._handleToDetailsClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._handlePopupWatchedClick = this._handlePopupWatchedClick.bind(this);
    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handleViewingPopup = this._handleViewingPopup.bind(this);
    this._handleCloseDetails = this._handleCloseDetails.bind(this);
  }

  init(film, popupContainer) {
    this._film = film;
    this._comments = this._getCommments();
    this._popupContainer = popupContainer;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments);

    this._filmCardComponent.setToDetailsClickHandler(this._handleToDetailsClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handlePopupFavoriteClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handlePopupWatchedClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handlePopupWatchlistClick);
    this._filmDetailsComponent.setClosePopupClickHandler(this._handleCloseDetails);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.element.contains(prevFilmCardComponent.element)) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmListContainer.element.contains(prevFilmDetailsComponent.element)) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._handleCloseDetails();
      document.removeEventListener(`keydown`, this._viewingPopupHandler);
    }
  }

  getFilmDetailsPopupScrollTop() {
    if (this._filmDetailsComponent !== null) {
      return this._filmDetailsComponent.element.scrollTop;
    }

    return 0;
  }

  showFilmDetailsPopup(popupScrollTop = null) {
    this._showPopup();

    if (popupScrollTop !== null) {
      this._filmDetailsComponent.element.scrollTop = popupScrollTop;
    }
  }

  _getCommments() {
    let comments = this._commentsModel.getComments();
    comments = comments.filter((comment) => {
      return this._film.comments.includes(comment.id);
    });

    return comments;
  }

  _showPopup() {
    this._popupContainer.appendChild(this._filmDetailsComponent.element);
    this._filmDetailsComponent.setViewingPopupHandler(this._handleViewingPopup);

    this._mode = Mode.DETAILED;
  }

  _handleToDetailsClick() {
    this._changeViewMode();
    this._showPopup();
    this._mode = Mode.DETAILED;
  }

  _handleViewingPopup(film) {
    const popupScrollTop = this._filmDetailsComponent.element.scrollTop;

    this._changeFilmData(film);
    this._showPopup();

    this._filmDetailsComponent.element.scrollTop = popupScrollTop;
  }

  _handleCloseDetails() {
    if (this._popupContainer.contains(this._filmDetailsComponent.element)) {
      this._popupContainer.removeChild(this._filmDetailsComponent.element);
      this._mode = Mode.DEFAULT;
    }
  }

  // обработчик клика по кнопке favirite
  _handleFavoriteClick(updateType = UpdateType.MINOR) {
    this._changeFilmData(
        ActionOnMovie.UPDATE,
        updateType,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }
  // обработчик клика по кнопке watched
  _handleWatchedClick(updateType = UpdateType.MINOR) {
    this._changeFilmData(
        ActionOnMovie.UPDATE,
        updateType,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  // обработчик клика по кнопке watchlist
  _handleWatchlistClick(updateType = UpdateType.MINOR) {
    this._changeFilmData(
        ActionOnMovie.UPDATE,
        updateType,
        Object.assign(
            {},
            this._film,
            {
              isWatchlisted: !this._film.isWatchlisted
            }
        )
    );
  }

  // обработчик клика по кнопке favirite в popup'е
  _handlePopupFavoriteClick() {
    this._handleFavoriteClick(UpdateType.MINOR_AND_POPUP);
  }

  // обработчик клика по кнопке watched в popup'е
  _handlePopupWatchedClick() {
    this._handleWatchedClick(UpdateType.MINOR_AND_POPUP);
  }

  // обработчик клика по кнопке watchlist в popup'е
  _handlePopupWatchlistClick() {
    this._handleWatchlistClick(UpdateType.MINOR_AND_POPUP);
  }

}
