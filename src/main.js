import UserRankView from "./view/user-rank";
import SiteMenuView from "./view/site-menu";
import SortingView from "./view/sorting";
import FilmsSectionView from "./view/films-section";
import FilmsListView from "./view/films-list";
import NoFilmView from "./view/no-film";
import FilmsListContainerView from "./view/film-list-container";
import ShowMoreButtonView from "./view/show-more-button";
import FilmsListMostCommentedView from "./view/films-list-most-commented";
import FilmsListTopRatedView from "./view/films-list-top-rated";
import FilmCardView from "./view/film-card";
import FilmsDetailsView from "./view/film-details";
import FilmsAmountView from "./view/films-amount";
import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";
import {FilmCount} from "./consts";
import {renderElement as render, RenderPosition,
  getFilmsSortedByRating, getFilmsSortedByCommentsAmount} from "./utils";


const films = new Array(FilmCount.FOR_FILMLIST).fill().map(generateFilm);
const filters = generateFilter(films);
const filmsTopRated = getFilmsSortedByRating(films);
const filmsMostCommented = getFilmsSortedByCommentsAmount(films);


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);


const renderFilmCard = (filmListContainer, film) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmsDetailsView(film);

  const showFilmDetailsPopup = () => {
    siteFooterElement.appendChild(filmDetailsComponent.element);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const hideFilmDetailsPopup = () => {
    siteFooterElement.removeChild(filmDetailsComponent.element);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (event) => {
    if (event.key === `Escape` || event.key === `Esc`) {
      event.preventDefault();
      hideFilmDetailsPopup();
    }
  };

  filmCardComponent.element.querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
  .forEach((element) => {
    element.addEventListener(`click`, (event) => {
      if (element.tagName === `a`) {
        event.preventDefault();
      }
      showFilmDetailsPopup();
    });
  });

  filmDetailsComponent.element.querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
    hideFilmDetailsPopup();
  });

  render(filmListContainer, filmCardComponent.element, RenderPosition.BEFOREEND);
};

const renderExtraFilmListFilmCards = (filmsSection, filmsList, sortedFilms) => {
  render(filmsSection.element, filmsList.element, RenderPosition.BEFOREEND);
  const FilmsListContainerComponent = new FilmsListContainerView();
  render(filmsList.element, FilmsListContainerComponent.element, RenderPosition.BEFOREEND);
  for (let i = 0; i < FilmCount.FOR_EXTRAFILMLIST; i++) {
    renderFilmCard(FilmsListContainerComponent.element, sortedFilms[i]);
  }
};

const renderFilmShowcase = (filmShowcaseContainer, presentedFilms) => {
  render(filmShowcaseContainer, new SiteMenuView(filters).element, RenderPosition.BEFOREEND);
  render(filmShowcaseContainer, new SortingView().element, RenderPosition.BEFOREEND);
  const filmsSectionComponent = new FilmsSectionView();
  render(filmShowcaseContainer, filmsSectionComponent.element, RenderPosition.BEFOREEND);


  if (presentedFilms.length === 0) {
    render(filmsSectionComponent.element, new NoFilmView().element, RenderPosition.BEFOREEND);
    return;
  }

  const FilmsListComponent = new FilmsListView();
  render(filmsSectionComponent.element, FilmsListComponent.element, RenderPosition.BEFOREEND);
  const FilmsListContainerComponent = new FilmsListContainerView();
  render(FilmsListComponent.element, FilmsListContainerComponent.element, RenderPosition.BEFOREEND);
  for (let i = 0; i < Math.min(FilmCount.PER_STEP, presentedFilms.length); i++) {
    renderFilmCard(FilmsListContainerComponent.element, presentedFilms[i]);
  }

  const FilmsListTopRatedComponent = new FilmsListTopRatedView();
  renderExtraFilmListFilmCards(filmsSectionComponent, FilmsListTopRatedComponent, filmsTopRated);

  const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  renderExtraFilmListFilmCards(filmsSectionComponent, filmsListMostCommentedComponent, filmsMostCommented);


  if (presentedFilms.length > FilmCount.PER_STEP) {
    let renderedFilmCount = FilmCount.PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();
    render(FilmsListComponent.element, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

    showMoreButtonComponent.element.addEventListener(`click`, (event) => {
      event.preventDefault();

      presentedFilms
        .slice(renderedFilmCount, renderedFilmCount + FilmCount.PER_STEP)
        .forEach((presentedFilm) => renderFilmCard(FilmsListContainerComponent.element, presentedFilm));

      renderedFilmCount += FilmCount.PER_STEP;
      if (renderedFilmCount >= presentedFilms.length) {
        showMoreButtonComponent.element.remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

};


render(siteHeaderElement, new UserRankView().element, RenderPosition.BEFOREEND);
renderFilmShowcase(siteMainElement, films);
render(footerStatisticsElement, new FilmsAmountView().element, RenderPosition.BEFOREEND);
