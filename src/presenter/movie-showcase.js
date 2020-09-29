import SortingView from "../view/sorting";
import FilmsSectionView from "../view/films-section";
import LoadingView from "../view/loading";
import NoFilmView from "../view/no-film";
import FilmsListView from "../view/films-list";
import FilmsListContainerView from "../view/film-list-container";
import FilmsListMostCommentedSectionView from "../view/films-list-most-commented";
import FilmsListTopRatedSectionView from "../view/films-list-top-rated";
import ShowMoreButtonView from "../view/show-more-button";
import MoviePresenter from "./movie";
import {render, RenderPosition, remove} from "../utils/render";
import {getFilmsSortedByRating, getFilmsSortedByCommentsAmount} from "../utils/films";
import {sortByDate, sortByRaiting} from "../utils/films";
import {filter} from "../utils/filter";
import {FilmCount, SortType, ActionOnMovie, ActionOnComment, UpdateType} from "../consts";
import Movies from "../model/movies";

export default class MovieList {
  constructor(movieShowcaseContainer, moviesModel, filterModel, commentsModel, api) {
    this._movieShowcaseContainer = movieShowcaseContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._api = api;
    this._renderedFilmCardsCount = FilmCount.PER_STEP;

    this._currentSortType = SortType.DEFAULT;
    this._updatedMovieId = null;

    this._baseMoviePresenter = {};
    this._topRaitedMoviePresenter = {};
    this._mostCommentedMoviePresenter = {};
    this._isLoading = true;

    this._showcaseSectionComponent = new FilmsSectionView();
    this._loadingComponent = new LoadingView();
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

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewModeChange = this._handleViewModeChange.bind(this);

    this._clearFilmListFilmCards = this._clearFilmListFilmCards.bind(this);
    this._renderExtraFilmListFilmCards = this._renderExtraFilmListFilmCards.bind(this);
  }

  init(popupContainer, handleUserRankUpdate) {
    this._popupContainer = popupContainer;
    this._popupScrollTop = 0;
    if (handleUserRankUpdate) {
      this._handleUserRankUpdate = handleUserRankUpdate;
    }

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._renderMovieShowcase();
  }

  destroy() {
    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);

    this._clearMovieShowcase({resetRenderedFilmCardsCount: true, resetSortType: true});
  }

  _getMovies() {
    const currentFilterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[currentFilterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RAITING:
        return filteredMovies.sort(sortByRaiting);
    }

    return filteredMovies;
  }
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
  _renderLoading() {
    render(this._showcaseSectionComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }
  // отрисовка экрана на случай отсутствия фильмов
  _renderNoFilms() {
    this._noFilmComponent = new NoFilmView();
    render(this._showcaseSectionComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка карточки фильма
  _renderFilmCard(filmListContainer, film, extraMoviePresenter = null) {
    const moviePresenter = new MoviePresenter(
        filmListContainer,
        this._handleViewAction, this._handleViewModeChange, this._handleUserRankUpdate,
        this._commentsModel);

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
  _renderBaseFilmListFilmCards() {
    if (this._baseFilmsListSectionComponent !== null) {
      this._baseFilmsListSectionComponent = null;
    }
    if (this._baseFilmsListContainerComponent !== null) {
      this._baseFilmsListContainerComponent = null;
    }

    this._baseFilmsListSectionComponent = new FilmsListView();
    this._baseFilmsListContainerComponent = new FilmsListContainerView();
    render(this._showcaseSectionComponent, this._baseFilmsListSectionComponent, RenderPosition.AFTERBEGIN);
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

    if (this._isLoading) {
      this._renderFilmSection();
      this._renderLoading();
      return;
    } else {
      this._renderSorting();
      this._renderFilmSection();
    }

    if (movieCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderBaseFilmListFilmCards();

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

  // очистка всех списков витрины вместе со всем их контейнерами
  _clearMovieShowcase({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    this._clearFilmListFilmCards(this._baseMoviePresenter);
    remove(this._baseFilmsListSectionComponent);
    remove(this._baseFilmsListContainerComponent);

    this._clearFilmListFilmCards(this._topRaitedMoviePresenter);
    remove(this._filmsListTopRaitedSectionComponent);
    remove(this._filmsListTopRaitedContainerComponent);

    this._clearFilmListFilmCards(this._mostCommentedMoviePresenter);
    remove(this._filmsListMostCommentedSectionComponent);
    remove(this._filmsListMostCommentedContainerComponent);

    remove(this._sortingComponent);
    remove(this._showcaseSectionComponent);
    remove(this._loadingComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);

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

  // обработка изменения сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderedFilmCardsCount = FilmCount.PER_STEP;
    this._renderSorting();

    this._clearMovieShowcase();
    this._renderMovieShowcase();
  }

  _handleViewAction(actionType, updateType, updatedMovie, updatedComment = null) {
    this._updatedMovieId = updatedMovie.id;
    switch (actionType) {
      case ActionOnMovie.UPDATE:
        // console.log(`updatedMovie =`, updatedMovie);
        this._api.updateMovie(updatedMovie)
        .then((response) => {
          this._moviesModel.updateMovie(updateType, Movies.adaptToClient(response));
        })
        .catch((err) => {
          console.log(`Some trouble detected...`);
          console.log(err);
        });
        this._updatedMovieId = null;
        break;
      case ActionOnComment.ADD:
        if (updatedComment === null) {
          throw new Error(`'updatedComment' parameter did not set`);
        }
        this._moviesModel.updateMovie(updateType, updatedMovie); // в результате инициирует вызов _handleModelEvent с теми же параметрами
        this._commentsModel.addComment(updateType, updatedComment);
        break;
      case ActionOnComment.DELETE:
        if (updatedComment === null) {
          throw new Error(`'updatedComment' parameter did not set`);
        }
        this._moviesModel.updateMovie(updateType, updatedMovie);
        this._commentsModel.deleteComment(updateType, updatedComment);
        break;
    }
    this._updatedMovieId = null;
  }

  // _handleModelEvent(updateType, data) { // в data может быть как фильм, так и комментарий
  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearMovieShowcase();
        this._renderMovieShowcase();
        break;
      case UpdateType.MINOR_AND_POPUP:
        let presentersWithMovie = this._defineNeededPresenters();
        let neededPresenter = null;
        if (presentersWithMovie.length) {
          for (let presenterWithMovie of presentersWithMovie) {
            const presenterPopupScrollTop = presenterWithMovie[this._updatedMovieId].getFilmDetailsPopupScrollTop();
            if (presenterPopupScrollTop > this._popupScrollTop) {
              this._popupScrollTop = presenterPopupScrollTop;
              neededPresenter = presenterWithMovie;
            }
          }
        }
        this._clearMovieShowcase();
        this._renderMovieShowcase();
        presentersWithMovie = this._defineNeededPresenters();
        if (presentersWithMovie.includes(neededPresenter)) {
          neededPresenter[this._updatedMovieId].showFilmDetailsPopup(this._popupScrollTop);
          this._popupScrollTop = 0;
        }
        // else {
        //   if (Object.keys(data).includes(`comments`)) {
        //     console.log(`The film is no longer the leader in the most commented section`);
        //   }
        // }
        break;
      case UpdateType.MAJOR:
        this._clearMovieShowcase({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderMovieShowcase();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._handleUserRankUpdate();
        this._renderMovieShowcase();
        break;
    }
  }

  _defineNeededPresenters(presentersWithMovie = []) {
    if (this._baseMoviePresenter[this._updatedMovieId]) {
      presentersWithMovie.push(this._baseMoviePresenter);
    }
    if (this._topRaitedMoviePresenter[this._updatedMovieId]) {
      presentersWithMovie.push(this._topRaitedMoviePresenter);
    }
    if (this._mostCommentedMoviePresenter[this._updatedMovieId]) {
      presentersWithMovie.push(this._mostCommentedMoviePresenter);
    }

    return presentersWithMovie;
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

  // обработка нажатия кнопки ShowMore
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
