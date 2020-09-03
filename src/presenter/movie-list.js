import SiteMenuView from "../view/site-menu";
import SortingView from "../view/sorting";
import FilmsSectionView from "../view/films-section";
import NoFilmView from "../view/no-film";
import FilmsListView from "../view/films-list";
import FilmsListContainerView from "../view/film-list-container";
import FilmsListMostCommentedView from "../view/films-list-most-commented";
import FilmsListTopRatedView from "../view/films-list-top-rated";
import ShowMoreButtonView from "../view/show-more-button";
import MoviePresenter from "./movie";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {getFilmsSortedByRating, getFilmsSortedByCommentsAmount} from "../utils/films";
import {FilmCount, SortType} from "../consts";
import {sortByDate, sortByRaiting} from "../utils/films";

export default class MovieList {
  constructor(movieShowcaseContainer, filters) {
    this._movieShowcaseContainer = movieShowcaseContainer;
    this._currentSortType = SortType.DEFAULT;

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
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movieShowcaseFilms, popupContainer) {
    this._movieShowcaseFilms = movieShowcaseFilms.slice();
    this._sourcedMovieShowcaseFilms = movieShowcaseFilms.slice();

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

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._movieShowcaseFilms.sort(sortByDate);
        break;
      case SortType.RAITING:
        this._movieShowcaseFilms.sort(sortByRaiting);
        break;
      default:
        this._movieShowcaseFilms = this._sourcedMovieShowcaseFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._refreshSorting(sortType);

    this._sortFilms(sortType);
    this._clearBaseFilmListFilmCards();
    this._renderBaseFilmListFilmCards(RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._movieShowcaseContainer, this._sortingComponent, RenderPosition.BEFOREEND);

    this._sortingComponent.setSortChangeHandler(this._handleSortTypeChange);
  }

  _refreshSorting(sortType) {
    this._currentSortType = sortType;
    const oldSortingComponent = this._sortingComponent;
    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortChangeHandler(this._handleSortTypeChange);
    replace(this._sortingComponent, oldSortingComponent);
    remove(oldSortingComponent);
  }

  _renderFilmSection() {
    render(this._movieShowcaseContainer, this._filmSectionComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilms() {
    render(this._filmSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(filmListContainer, film, popupContainer) {
    const moviePresenter = new MoviePresenter(filmListContainer);
    moviePresenter.init(film, popupContainer);
  }

  _handleShowMoreButtonClick() {
    this._movieShowcaseFilms
    .slice(this._renderedFilmCardsCount, this._renderedFilmCardsCount + FilmCount.PER_STEP)
    .forEach((movieShowcaseFilm) => this._renderFilmCard(
        this._baseFilmsListContainerComponent, movieShowcaseFilm, this._popupContainer));

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

  _clearBaseFilmListFilmCards() {
    this._baseFilmsListContainerComponent.element.innerHTML = ``;
    this._renderedFilmCardsCount = FilmCount.PER_STEP;
  }

  _renderBaseFilmListFilmCards(position = RenderPosition.BEFOREEND) {
    render(this._filmSectionComponent, this._baseFilmsListComponent, position);
    render(this._baseFilmsListComponent, this._baseFilmsListContainerComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(FilmCount.PER_STEP, this._movieShowcaseFilms.length); i++) {
      this._renderFilmCard(
          this._baseFilmsListContainerComponent, this._movieShowcaseFilms[i], this._popupContainer);
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
      this._renderFilmCard(FilmsListContainerComponent, sortedFilms[i], this._popupContainer);
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
