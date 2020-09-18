// import FilterMenuView from "../view/filter-menu";
import SortingView from "../view/sorting";
import FilmsSectionView from "../view/films-section";
import NoFilmView from "../view/no-film";
import FilmsListView from "../view/films-list";
import FilmsListContainerView from "../view/film-list-container";
import FilmsListMostCommentedSectionView from "../view/films-list-most-commented";
import FilmsListTopRatedSectionView from "../view/films-list-top-rated";
import ShowMoreButtonView from "../view/show-more-button";
import MoviePresenter from "./movie";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {getFilmsSortedByRating, getFilmsSortedByCommentsAmount} from "../utils/films";
import {FilmCount, SortType, RefreshingTarget} from "../consts";
import {sortByDate, sortByRaiting} from "../utils/films";

export default class MovieList {
  constructor(movieShowcaseContainer, moviesModel) {
    this._movieShowcaseContainer = movieShowcaseContainer;
    this._moviesModel = moviesModel;
    this._currentSortType = SortType.DEFAULT;

    this._baseMoviePresenter = {};
    this._topRaitedMoviePresenter = {};
    this._mostCommentedMoviePresenter = {};

    this._sortingComponent = new SortingView();
    this._showcaseSectionComponent = new FilmsSectionView();
    this._noFilmComponent = new NoFilmView();

    this._baseFilmsListSectionComponent = new FilmsListView();
    this._baseFilmsListContainerComponent = new FilmsListContainerView();

    this._filmsListTopRaitedSectionComponent = new FilmsListTopRatedSectionView();
    this._filmsListTopRaitedContainerComponent = new FilmsListContainerView();
    this._filmsListMostCommentedSectionComponent = new FilmsListMostCommentedSectionView();
    this._filmsListMostCommentedContainerComponent = new FilmsListContainerView();

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleViewModeChange = this._handleViewModeChange.bind(this);

    this._clearFilmListFilmCards = this._clearFilmListFilmCards.bind(this);
    this._renderExtraFilmListFilmCards = this._renderExtraFilmListFilmCards.bind(this);
    this._refreshFilmLists = this._refreshFilmLists.bind(this);
    this._refreshBaseFilmList = this._refreshBaseFilmList.bind(this);
    this._refreshTopRaitedFilmList = this._refreshTopRaitedFilmList.bind(this);
    this._refreshMostCommentedFilmList = this._refreshMostCommentedFilmList.bind(this);
  }

  // init(movieShowcaseFilms, popupContainer) {
  init(popupContainer) {
    this._popupContainer = popupContainer;
    this._renderedFilmCardsCount = FilmCount.PER_STEP;

    // this._movieShowcaseFilms = movieShowcaseFilms.slice();
    // this._sourcedMovieShowcaseFilms = movieShowcaseFilms.slice();

    this._renderSorting();
    this._renderFilmSection();

    this._renderMovieShowcase();
  }

  _getMovies() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._moviesModel.getMovies().slice().sort(sortByDate);
      case SortType.RAITING:
        return this._moviesModel.getMovies().slice().sort(sortByRaiting);
    }

    return this._moviesModel.getMovies();
  }

  // _sortFilms(sortType) {
  //   switch (sortType) {
  //     case SortType.DATE:
  //       this._movieShowcaseFilms.sort(sortByDate);
  //       break;
  //     case SortType.RAITING:
  //       this._movieShowcaseFilms.sort(sortByRaiting);
  //       break;
  //     default:
  //       this._movieShowcaseFilms = this._sourcedMovieShowcaseFilms.slice();
  //   }

  //   this._currentSortType = sortType;
  // }

  // первичная отрисовка компонента сортировки
  _renderSorting() {
    render(this._movieShowcaseContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortChangeHandler(this._handleSortTypeChange);
  }

  // обновление компонента сортировки
  _refreshSorting(sortType) {
    this._currentSortType = sortType;
    const oldSortingComponent = this._sortingComponent;
    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortChangeHandler(this._handleSortTypeChange);
    replace(this._sortingComponent, oldSortingComponent);
    remove(oldSortingComponent);
  }

  // отрисовка контейнера всей витрины
  _renderFilmSection() {
    render(this._movieShowcaseContainer, this._showcaseSectionComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка экрана на случай отсутствия фильмов
  _renderNoFilms() {
    render(this._showcaseSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка карточки фильма
  _renderFilmCard(filmListContainer, film, extraMoviePresenter = null) {
    const moviePresenter = new MoviePresenter(
        filmListContainer, this._handleFilmChange, this._refreshFilmLists, this._handleViewModeChange);

    moviePresenter.init(film, this._popupContainer);

    if (extraMoviePresenter !== null) {
      if (!Object.keys(extraMoviePresenter).includes(film.id)) {
        extraMoviePresenter[film.id] = moviePresenter;
      }
      return;
    }
    this._baseMoviePresenter[film.id] = moviePresenter;
  }

  _renderFilmCards(filmListContainer, filmCards, extraMoviePresenter = null) {
    filmCards.forEach((filmCard) => this._renderFilmCard(filmListContainer, filmCard, extraMoviePresenter));
  }

  // отрисовка + установка обработчика клика на кнопке "Показать еще"
  _renderShowMoreButton() {
    render(this._baseFilmsListSectionComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  // отрисовка первого блока основного списка фильмов
  _renderBaseFilmListFilmCards(position = RenderPosition.BEFOREEND) {
    render(this._showcaseSectionComponent, this._baseFilmsListSectionComponent, position);
    render(this._baseFilmsListSectionComponent, this._baseFilmsListContainerComponent, RenderPosition.BEFOREEND);

    const filmCards = this._getMovies();
    const filmCardsCount = filmCards.length;
    this._renderFilmCards(
        this._baseFilmsListContainerComponent,
        filmCards.slice(0, Math.min(filmCardsCount, this._renderedFilmCardsCount)));

    if (this._getMovies().length > FilmCount.PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  // отрисовка контейнеров для одного из экстра-списков фильмов
  _renderExtraFilmsListShell(extraFilmListSectionComponent, extraFilmsListContainerComponent) {
    render(this._showcaseSectionComponent, extraFilmListSectionComponent, RenderPosition.BEFOREEND);
    render(extraFilmListSectionComponent, extraFilmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка фильмов одного из экстра списков
  _renderExtraFilmListFilmCards(filmsListContainer, sortedFilms, extraMoviePresenter) {
    // for (let i = 0; i < FilmCount.FOR_EXTRAFILMLIST; i++) {
    //   this._renderFilmCard(
    //       filmsListContainer, sortedFilms[i], extraMoviePresenter);
    // }
    this._renderFilmCards(
        filmsListContainer, sortedFilms.slice(0, FilmCount.FOR_EXTRAFILMLIST), extraMoviePresenter);
  }

  // [агрегатор] отрисовка витрины со всеми списками фильмов: основного и экстра
  _renderMovieShowcase() {
    if (!this._getMovies().length) {
      render(this._showcaseSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderBaseFilmListFilmCards();

    this._renderExtraFilmsListShell(
        this._filmsListTopRaitedSectionComponent,
        this._filmsListTopRaitedContainerComponent);
    this._renderExtraFilmListFilmCards(
        this._filmsListTopRaitedContainerComponent,
        getFilmsSortedByRating(this._moviesModel.getMovies()),
        this._topRaitedMoviePresenter);

    this._renderExtraFilmsListShell(
        this._filmsListMostCommentedSectionComponent,
        this._filmsListMostCommentedContainerComponent);
    this._renderExtraFilmListFilmCards(
        this._filmsListMostCommentedContainerComponent,
        getFilmsSortedByCommentsAmount(this._moviesModel.getMovies()),
        this._mostCommentedMoviePresenter);
  }

  // очистка переданного списка фильмов
  _clearFilmListFilmCards(moviePresenter) {
    Object
      .values(moviePresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
    for (let key of Object.keys(moviePresenter)) {
      delete moviePresenter[key];
    }
    if (Object.is(moviePresenter, this._baseMoviePresenter)) {
      this._renderedFilmCardsCount = FilmCount.PER_STEP;
    }
  }

  // [агрегатор] обновление основного списка фильмов
  _refreshBaseFilmList() {
    this._clearFilmListFilmCards(this._baseMoviePresenter);
    this._renderBaseFilmListFilmCards(RenderPosition.AFTERBEGIN);
  }

  // [агрегатор] обновление экстра-списка самых рейтинговых фильмов
  _refreshTopRaitedFilmList() {
    this._clearFilmListFilmCards(this._topRaitedMoviePresenter);
    this._renderExtraFilmListFilmCards(
        this._filmsListTopRaitedContainerComponent,
        getFilmsSortedByRating(this._moviesModel.getMovies()),
        this._topRaitedMoviePresenter);
  }

  // [агрегатор] обновление экстра-списка самых комментируемых фильмов
  _refreshMostCommentedFilmList() {
    this._clearFilmListFilmCards(this._mostCommentedMoviePresenter);
    this._renderExtraFilmListFilmCards(
        this._filmsListMostCommentedContainerComponent,
        getFilmsSortedByCommentsAmount(this._moviesModel.getMovies()),
        this._mostCommentedMoviePresenter);
  }

  // [агрегатор агрегаторов] обновление любых списков фильмов
  _refreshFilmLists(refreshingTarget = RefreshingTarget.ALL) {
    switch (refreshingTarget) {
      case RefreshingTarget.ALL:
        this._refreshBaseFilmList();
        this._refreshTopRaitedFilmList();
        this._refreshMostCommentedFilmList();
        break;
      case RefreshingTarget.BASE:
        this._refreshBaseFilmList();
        break;
      case RefreshingTarget.EXTRA:
        this._refreshTopRaitedFilmList();
        this._refreshMostCommentedFilmList();
        break;
      case RefreshingTarget.TOP_RAITED:
        this._refreshTopRaitedFilmList();
        break;
      case RefreshingTarget.MOST_COMMENTED:
        this._refreshMostCommentedFilmList();
        break;
    }
  }

  // обработка изменения сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._refreshSorting(sortType);
    //
    // this._sortFilms(sortType);
    // this._currentSortType = sortType;
    //
    this._refreshFilmLists();
  }

  _handleFilmChange(updatedFilm) {
    // this._movieShowcaseFilms = MovieList.updateItem(this._movieShowcaseFilms, updatedFilm);
    // this._sourcedMovieShowcaseFilms = MovieList.updateItem(this._sourcedMovieShowcaseFilms, updatedFilm);
    if (Object.keys(this._baseMoviePresenter).includes(updatedFilm.id)) {
      this._baseMoviePresenter[updatedFilm.id].init(updatedFilm, this._popupContainer);
    }
    if (Object.keys(this._topRaitedMoviePresenter).includes(updatedFilm.id)) {
      this._topRaitedMoviePresenter[updatedFilm.id].init(updatedFilm, this._popupContainer);
    }
    if (Object.keys(this._mostCommentedMoviePresenter).includes(updatedFilm.id)) {
      this._mostCommentedMoviePresenter[updatedFilm.id].init(updatedFilm, this._popupContainer);
    }
  }

  // закрытие всех открытых попапов у карточек фильмов
  _handleViewModeChange() {
    [
      this._baseMoviePresenter,
      this._topRaitedMoviePresenter,
      this._mostCommentedMoviePresenter
    ].forEach((moviePresenter) => {
      Object
        .values(moviePresenter)
        .forEach((presenter) => presenter.resetView());
    });
  }

  _handleShowMoreButtonClick() {
    // this._movieShowcaseFilms
    // .slice(this._renderedFilmCardsCount, this._renderedFilmCardsCount + FilmCount.PER_STEP)
    // .forEach((movieShowcaseFilm) => this._renderFilmCard(
    //     this._baseFilmsListContainerComponent, movieShowcaseFilm));

    // this._renderedFilmCardsCount += FilmCount.PER_STEP;

    const filmCardsCount = this._getMovies().length;
    const newRenderedFilmCardCount = Math.min(filmCardsCount, this._renderedFilmCardsCount + FilmCount.PER_STEP);
    const filmCards = this._getMovies().slice(this._renderedFilmCardsCount, newRenderedFilmCardCount);

    this._renderFilmCards(this._baseFilmsListContainerComponent, filmCards);
    this._renderedFilmCardsCount = newRenderedFilmCardCount;

    if (this._renderedFilmCardsCount >= filmCardsCount) {
      this._showMoreButtonComponent.element.remove();
      this._showMoreButtonComponent.removeElement();
    }
  }

  static updateItem(items, updatedItem) {
    const index = items.findIndex((item) => item.id === updatedItem.id);

    if (index === -1) {
      return items;
    }

    return [
      ...items.slice(0, index),
      updatedItem,
      ...items.slice(index + 1)
    ];
  }
}
