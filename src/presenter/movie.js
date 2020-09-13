import FilmCardView from "../view/film-card";
import FilmDetailsView from "../view/film-details";
import {render, replace, remove, RenderPosition} from "../utils/render";

const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILED: `DETAILED`
};

export default class Movie {
  constructor(filmListContainer, changeFilmData, refreshFilmLists, changeViewMode) {
    this._filmListContainer = filmListContainer;
    this._changeFilmData = changeFilmData;
    this._changeViewMode = changeViewMode;
    this._refreshFilmLists = refreshFilmLists;

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
    this._popupContainer = popupContainer;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmDetailsComponent = new FilmDetailsView(this._film);

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

  _showFilmDetailsPopup() {
    this._popupContainer.appendChild(this._filmDetailsComponent.element);
    this._filmDetailsComponent.setViewingPopupHandler(this._handleViewingPopup);
  }

  _handleToDetailsClick() {
    this._changeViewMode();
    this._showFilmDetailsPopup();
    this._mode = Mode.DETAILED;
  }

  _handleViewingPopup(film) {
    const popupScrollTop = this._filmDetailsComponent.element.scrollTop;

    this._changeFilmData(film);
    this._refreshFilmLists(`most-commented`);
    this._showFilmDetailsPopup();

    this._filmDetailsComponent.element.scrollTop = popupScrollTop;
  }

  _handleCloseDetails() {
    if (this._popupContainer.contains(this._filmDetailsComponent.element)) {
      this._popupContainer.removeChild(this._filmDetailsComponent.element);
      this._mode = Mode.DEFAULT;
    }
  }

  _handleFavoriteClick() {
    this._changeFilmData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeFilmData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleWatchlistClick() {
    this._changeFilmData(
        Object.assign(
            {},
            this._film,
            {
              isWatchlisted: !this._film.isWatchlisted
            }
        )
    );
  }

  _handlePopupFavoriteClick() {
    const popupScrollTop = this._filmDetailsComponent.element.scrollTop;
    this._handleFavoriteClick();
    this._showFilmDetailsPopup();
    this._filmDetailsComponent.element.scrollTop = popupScrollTop;
  }

  _handlePopupWatchedClick() {
    const popupScrollTop = this._filmDetailsComponent.element.scrollTop;
    this._handleWatchedClick();
    this._showFilmDetailsPopup();
    this._filmDetailsComponent.element.scrollTop = popupScrollTop;
  }

  _handlePopupWatchlistClick() {
    const popupScrollTop = this._filmDetailsComponent.element.scrollTop;
    this._handleWatchlistClick();
    this._showFilmDetailsPopup();
    this._filmDetailsComponent.element.scrollTop = popupScrollTop;
  }

}
