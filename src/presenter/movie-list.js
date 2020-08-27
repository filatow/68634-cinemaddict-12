import SiteMenuView from "../view/site-menu";
import SortingView from "../view/sorting";
import FilmsSectionView from "../view/films-section";
import NoFilmView from "../view/no-film";
import FilmsListView from "../view/films-list";
import FilmsListContainerView from "../view/film-list-container";
import FilmsListMostCommentedView from "../view/films-list-most-commented";
import FilmsListTopRatedView from "../view/films-list-top-rated";
import ShowMoreButtonView from "../view/show-more-button";
import FilmCardView from "../view/film-card";
import FilmsDetailsView from "../view/film-details";
import {render, RenderPosition} from "../utils/render";
import {isEscKeyPressed} from "../utils/common";
import {getFilmsSortedByRating, getFilmsSortedByCommentsAmount} from "../utils/films";
import {FilmCount} from "../consts";

export default class MovieList {
  constructor(movieShowcaseContainer, filters) {
    this._movieShowcaseContainer = movieShowcaseContainer;

    this._siteMenuComponent = new SiteMenuView(filters);
    this._sortingComponent = new SortingView();
    this._filmSectionComponent = new FilmsSectionView();
    this._noFilmComponent = new NoFilmView();

    this._baseFilmsListComponent = new FilmsListView();
    this._baseFilmsListContainerComponent = new FilmsListContainerView();

    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._filmsListTopRaitedComponent = new FilmsListTopRatedView();

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(movieShowcaseFilms, popupContainer) {
    this._movieShowcaseFilms = movieShowcaseFilms.slice();
    this._popupContainer = popupContainer;
    this._renderedFilmCardsCount = FilmCount.PER_STEP;

    this._renderSiteMenu();
    this._renderSorting();
    this._renderFilmSection();

    this._renderMovieShowcase();
  }

  _renderSiteMenu() {
    render(this._movieShowcaseContainer, this._siteMenuComponent, RenderPosition.BEFOREEND);
  }
  _renderSorting() {
    render(this._movieShowcaseContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }
  _renderFilmSection() {
    render(this._movieShowcaseContainer, this._filmSectionComponent, RenderPosition.BEFOREEND);
  }
  _renderNoFilms() {
    render(this._filmSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(filmListContainer, film) {
    const filmCardComponent = new FilmCardView(film);
    const filmDetailsComponent = new FilmsDetailsView(film);

    const showFilmDetailsPopup = () => {
      this._popupContainer.appendChild(filmDetailsComponent.element);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const hideFilmDetailsPopup = () => {
      this._popupContainer.removeChild(filmDetailsComponent.element);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (event) => {
      if (isEscKeyPressed) {
        event.preventDefault();
        hideFilmDetailsPopup();
      }
    };

    filmCardComponent.setToDetailsClickHandler(() => {
      showFilmDetailsPopup();
    });

    filmDetailsComponent.setCloseDetailsClickHandler(() => {
      hideFilmDetailsPopup();
    });

    render(filmListContainer, filmCardComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._movieShowcaseFilms
    .slice(this._renderedFilmCardsCount, this._renderedFilmCardsCount + FilmCount.PER_STEP)
    .forEach((movieShowcaseFilm) => this._renderFilmCard(this._baseFilmsListContainerComponent, movieShowcaseFilm));

    this._renderedFilmCardsCount += FilmCount.PER_STEP;
    if (this._renderedFilmCardsCount >= this._movieShowcaseFilms.length) {
      this._showMoreButtonComponent.element.remove();
      this._showMoreButtonComponent.removeElement();
    }
  }

  _renderShowMoreButton() {
    render(this._baseFilmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderBaseFilmListFilmCards() {
    render(this._filmSectionComponent, this._baseFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._baseFilmsListComponent, this._baseFilmsListContainerComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < Math.min(FilmCount.PER_STEP, this._movieShowcaseFilms.length); i++) {
      this._renderFilmCard(this._baseFilmsListContainerComponent, this._movieShowcaseFilms[i]);
    }

    if (this._movieShowcaseFilms.length > FilmCount.PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderExtraFilmListFilmCards(filmsList, sortedFilms) {
    render(this._filmSectionComponent, filmsList, RenderPosition.BEFOREEND);
    const FilmsListContainerComponent = new FilmsListContainerView();
    render(filmsList, FilmsListContainerComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < FilmCount.FOR_EXTRAFILMLIST; i++) {
      this._renderFilmCard(FilmsListContainerComponent, sortedFilms[i]);
    }
  }

  _renderMovieShowcase() {
    if (!this._movieShowcaseFilms.length) {
      render(this._filmSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderBaseFilmListFilmCards();
    this._renderExtraFilmListFilmCards(this._filmsListTopRaitedComponent, getFilmsSortedByRating(this._movieShowcaseFilms));
    this._renderExtraFilmListFilmCards(this._filmsListMostCommentedComponent, getFilmsSortedByCommentsAmount(this._movieShowcaseFilms));
  }

}
