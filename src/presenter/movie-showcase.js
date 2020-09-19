import SortingView from "../view/sorting";
import FilmsSectionView from "../view/films-section";
import NoFilmView from "../view/no-film";
import FilmsListView from "../view/films-list";
import FilmsListContainerView from "../view/film-list-container";
import FilmsListMostCommentedSectionView from "../view/films-list-most-commented";
import FilmsListTopRatedSectionView from "../view/films-list-top-rated";
import ShowMoreButtonView from "../view/show-more-button";
import MoviePresenter from "./movie";
import {render, RenderPosition, remove} from "../utils/render";
import {getFilmsSortedByRating, getFilmsSortedByCommentsAmount} from "../utils/films";
import {FilmCount, SortType, ActionOnMovie, ActionOnComment, UpdateType} from "../consts";
// import {RefreshingTarget} from "../consts";
import {sortByDate, sortByRaiting} from "../utils/films";

export default class MovieList {
  constructor(movieShowcaseContainer, moviesModel, commentsModel) {
    this._movieShowcaseContainer = movieShowcaseContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._currentSortType = SortType.DEFAULT;

    this._baseMoviePresenter = {};
    this._topRaitedMoviePresenter = {};
    this._mostCommentedMoviePresenter = {};

    this._sortingComponent = null;
    this._showMoreButtonComponent = null;

    this._showcaseSectionComponent = null;
    this._noFilmComponent = null;

    this._baseFilmsListSectionComponent = null;
    this._baseFilmsListContainerComponent = null;
    this._filmsListTopRaitedSectionComponent = null;
    this._filmsListTopRaitedContainerComponent = null;
    this._filmsListMostCommentedSectionComponent = null;
    this._filmsListMostCommentedContainerComponent = null;
    // this._baseFilmsListSectionComponent = new FilmsListView();
    // this._baseFilmsListContainerComponent = new FilmsListContainerView();
    // this._filmsListTopRaitedSectionComponent = new FilmsListTopRatedSectionView();
    // this._filmsListTopRaitedContainerComponent = new FilmsListContainerView();
    // this._filmsListMostCommentedSectionComponent = new FilmsListMostCommentedSectionView();
    // this._filmsListMostCommentedContainerComponent = new FilmsListContainerView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewModeChange = this._handleViewModeChange.bind(this);

    this._clearFilmListFilmCards = this._clearFilmListFilmCards.bind(this);
    this._renderExtraFilmListFilmCards = this._renderExtraFilmListFilmCards.bind(this);
    // this._refreshFilmLists = this._refreshFilmLists.bind(this);
    // this._refreshBaseFilmList = this._refreshBaseFilmList.bind(this);
    // this._refreshTopRaitedFilmList = this._refreshTopRaitedFilmList.bind(this);
    // this._refreshMostCommentedFilmList = this._refreshMostCommentedFilmList.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  // init(movieShowcaseFilms, popupContainer) {
  init(popupContainer) {
    this._popupContainer = popupContainer;
    this._renderedFilmCardsCount = FilmCount.PER_STEP;

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

  // обновление компонента сортировки
  // _refreshSorting(sortType) {
  //   this._currentSortType = sortType;
  //   const oldSortingComponent = this._sortingComponent;
  //   this._sortingComponent = new SortingView(this._currentSortType);
  //   this._sortingComponent.setSortChangeHandler(this._handleSortTypeChange);
  //   replace(this._sortingComponent, oldSortingComponent);
  //   remove(oldSortingComponent);
  // }

  // отрисовка компонента сортировки
  _renderSorting() {
    if (this._sortingComponent !== null) {
      remove(this._sortingComponent);
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortChangeHandler(this._handleSortTypeChange);
    render(this._movieShowcaseContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка контейнера всей витрины
  _renderFilmSection() {
    if (this._showcaseSectionComponent !== null) {
      this._showcaseSectionComponent = null;
    }

    this._showcaseSectionComponent = new FilmsSectionView();
    render(this._movieShowcaseContainer, this._showcaseSectionComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка экрана на случай отсутствия фильмов
  _renderNoFilms() {
    this._noFilmComponent = new NoFilmView();
    render(this._showcaseSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка карточки фильма
  _renderFilmCard(filmListContainer, film, extraMoviePresenter = null) {
    const moviePresenter = new MoviePresenter(
        filmListContainer, this._handleViewAction, this._handleViewModeChange);

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
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._baseFilmsListSectionComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка основного списка фильмов
  _renderBaseFilmListFilmCards(position = RenderPosition.BEFOREEND) {
    if (this._baseFilmsListSectionComponent !== null) {
      this._baseFilmsListSectionComponent = null;
    }
    if (this._baseFilmsListContainerComponent !== null) {
      this._baseFilmsListContainerComponent = null;
    }

    this._baseFilmsListSectionComponent = new FilmsListView();
    this._baseFilmsListContainerComponent = new FilmsListContainerView();
    render(this._showcaseSectionComponent, this._baseFilmsListSectionComponent, position);
    render(this._baseFilmsListSectionComponent, this._baseFilmsListContainerComponent, RenderPosition.BEFOREEND);

    const movies = this._getMovies();
    const moviesCount = movies.length;
    this._renderFilmCards(
        this._baseFilmsListContainerComponent,
        movies.slice(0, Math.min(moviesCount, this._renderedFilmCardsCount)));

    if (moviesCount > this._renderedFilmCardsCount) {
      this._renderShowMoreButton();
    }
  }

  // отрисовка контейнеров для одного из экстра-списков фильмов
  _renderExtraFilmsListShell(extraFilmListSectionComponent, extraFilmsListContainerComponent) {
    render(this._showcaseSectionComponent, extraFilmListSectionComponent, RenderPosition.BEFOREEND);
    render(extraFilmListSectionComponent, extraFilmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  _renderTopRaitedFilmsListShell() {
    if (this._filmsListTopRaitedSectionComponent !== null) {
      this._filmsListTopRaitedSectionComponent = null;
    }
    if (this._filmsListTopRaitedContainerComponent !== null) {
      this._filmsListTopRaitedContainerComponent = null;
    }

    this._filmsListTopRaitedSectionComponent = new FilmsListTopRatedSectionView();
    this._filmsListTopRaitedContainerComponent = new FilmsListContainerView();

    this._renderExtraFilmsListShell(
        this._filmsListTopRaitedSectionComponent,
        this._filmsListTopRaitedContainerComponent);
  }

  _renderMostCommentedFilmsListShell() {
    if (this._filmsListMostCommentedSectionComponent !== null) {
      this._filmsListMostCommentedSectionComponent = null;
    }
    if (this._filmsListMostCommentedContainerComponent !== null) {
      this._filmsListMostCommentedContainerComponent = null;
    }

    this._filmsListMostCommentedSectionComponent = new FilmsListMostCommentedSectionView();
    this._filmsListMostCommentedContainerComponent = new FilmsListContainerView();

    this._renderExtraFilmsListShell(
        this._filmsListMostCommentedSectionComponent,
        this._filmsListMostCommentedContainerComponent);
  }

  // отрисовка фильмов одного из экстра списков
  _renderExtraFilmListFilmCards(filmsListContainer, sortedFilms, extraMoviePresenter) {
    this._renderFilmCards(
        filmsListContainer, sortedFilms.slice(0, FilmCount.FOR_EXTRAFILMLIST), extraMoviePresenter);
  }

  // [агрегатор] отрисовка витрины со всеми списками фильмов: основного и экстра-списков
  _renderMovieShowcase() {
    const movies = this._getMovies();
    const movieCount = movies.length;

    if (movieCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSorting();
    this._renderFilmSection();

    this._renderBaseFilmListFilmCards(RenderPosition.AFTERBEGIN);

    this._renderTopRaitedFilmsListShell();
    this._renderExtraFilmListFilmCards(
        this._filmsListTopRaitedContainerComponent,
        getFilmsSortedByRating(movies),
        this._topRaitedMoviePresenter);

    this._renderMostCommentedFilmsListShell();
    this._renderExtraFilmListFilmCards(
        this._filmsListMostCommentedContainerComponent,
        getFilmsSortedByCommentsAmount(movies),
        this._mostCommentedMoviePresenter);
  }

  _clearMovieShowcase({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    //
    this._clearFilmListFilmCards(this._baseMoviePresenter);
    remove(this._baseFilmsListSectionComponent);
    remove(this._baseFilmsListContainerComponent);

    this._clearFilmListFilmCards(this._topRaitedMoviePresenter);
    remove(this._filmsListTopRaitedSectionComponent);
    remove(this._filmsListTopRaitedContainerComponent);

    this._clearFilmListFilmCards(this._mostCommentedMoviePresenter);
    remove(this._filmsListMostCommentedSectionComponent);
    remove(this._filmsListMostCommentedContainerComponent);
    //
    remove(this._sortingComponent);
    remove(this._showcaseSectionComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    //

    if (resetRenderedFilmCardsCount) {
      this._renderedFilmCardsCount = FilmCount.PER_STEP;
    } else {
      this._renderedFilmCardsCount = Math.min(moviesCount, this._renderedFilmCardsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
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
  }

  // [агрегатор] обновление основного списка фильмов
  // _refreshBaseFilmList() {
  //   this._clearFilmListFilmCards(this._baseMoviePresenter);
  //   this._renderBaseFilmListFilmCards(RenderPosition.AFTERBEGIN);
  // }

  // [агрегатор] обновление экстра-списка самых рейтинговых фильмов
  // _refreshTopRaitedFilmList() {
  //   this._clearFilmListFilmCards(this._topRaitedMoviePresenter);
  //   this._renderExtraFilmListFilmCards(
  //       this._filmsListTopRaitedContainerComponent,
  //       getFilmsSortedByRating(this._moviesModel.getMovies()),
  //       this._topRaitedMoviePresenter);
  // }

  // [агрегатор] обновление экстра-списка самых комментируемых фильмов
  // _refreshMostCommentedFilmList() {
  //   this._clearFilmListFilmCards(this._mostCommentedMoviePresenter);
  //   this._renderExtraFilmListFilmCards(
  //       this._filmsListMostCommentedContainerComponent,
  //       getFilmsSortedByCommentsAmount(this._moviesModel.getMovies()),
  //       this._mostCommentedMoviePresenter);
  // }

  // [агрегатор агрегаторов] обновление любых списков фильмов
  // _refreshFilmLists(refreshingTarget = RefreshingTarget.ALL) {
  //   switch (refreshingTarget) {
  //     case RefreshingTarget.ALL:
  //       this._refreshBaseFilmList();
  //       this._refreshTopRaitedFilmList();
  //       this._refreshMostCommentedFilmList();
  //       break;
  //     case RefreshingTarget.BASE:
  //       this._refreshBaseFilmList();
  //       break;
  //     case RefreshingTarget.EXTRA:
  //       this._refreshTopRaitedFilmList();
  //       this._refreshMostCommentedFilmList();
  //       break;
  //     case RefreshingTarget.TOP_RAITED:
  //       this._refreshTopRaitedFilmList();
  //       break;
  //     case RefreshingTarget.MOST_COMMENTED:
  //       this._refreshMostCommentedFilmList();
  //       break;
  //   }
  // }

  // обработка изменения сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderSorting();

    this._clearMovieShowcase();
    this._renderMovieShowcase();
  }

  _handleFilmChange(updatedFilm) {
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case ActionOnMovie.UPDATE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case ActionOnComment.ADD:
        this._commentsModel.addComment(updateType, update);
        break;
      case ActionOnComment.DELETE:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType) {
  // _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearMovieShowcase();
        this._renderMovieShowcase();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearMovieShowcase({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderMovieShowcase();
        break;
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
}
