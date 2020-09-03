import FilmCardView from "../view/film-card";
import FilmsDetailsView from "../view/film-details";
import {render, replace, remove, RenderPosition} from "../utils/render";
import {isEscKeyPressed} from "../utils/common";

export default class Movie {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleToDetailsClick = this._handleToDetailsClick.bind(this);
    this._handleCloseDetailsClick = this._handleCloseDetailsClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init(film, popupContainer) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmDetailsComponent = new FilmsDetailsView(this._film);
    this._popupContainer = popupContainer;

    this._filmCardComponent.setToDetailsClickHandler(this._handleToDetailsClick);
    this._filmDetailsComponent.setCloseDetailsClickHandler(this._handleCloseDetailsClick);

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

  _showFilmDetailsPopup() {
    this._popupContainer.appendChild(this._filmDetailsComponent.element);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _hideFilmDetailsPopup() {
    this._popupContainer.removeChild(this._filmDetailsComponent.element);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleEscKeyDown(event) {
    if (isEscKeyPressed) {
      event.preventDefault();
      this._hideFilmDetailsPopup();
    }
  }

  _handleToDetailsClick() {
    this._showFilmDetailsPopup();
  }

  _handleCloseDetailsClick() {
    this._hideFilmDetailsPopup();
  }

}
