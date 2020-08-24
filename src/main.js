import UserRankView from "./view/user-rank";
import SiteMenuView from "./view/site-menu";
import SortingView from "./view/sorting";
import FilmsSectionView from "./view/films-section";
import FilmsListView from "./view/films-list";
import FilmsListContainerView from "./view/film-list-container";
import ShowMoreButtonView from "./view/show-more-button";
import FilmsListMostCommentedView from "./view/films-list-most-commented";
import FilmsListTopRatedView from "./view/films-list-top-rated";
import FilmCardView from "./view/film-card";
import FilmsDetailsView from "./view/film-details";
import FilmsAmountView from "./view/films-amount";
import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";
import {FilmCounters as FilmCounter} from "./consts";
import {renderElement as render, RenderPosition} from "./utils";


const films = new Array(FilmCounter.FOR_FILMLIST).fill().map(generateFilm);
const filters = generateFilter(films);
const filmsTopRated = new Array(FilmCounter.FOR_EXTRAFILMLIST).fill().map(generateFilm);
const filmsMostCommented = new Array(FilmCounter.FOR_EXTRAFILMLIST).fill().map(generateFilm);


const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserRankView().element, RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

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

render(siteMainElement, new SiteMenuView(filters).element, RenderPosition.BEFOREEND);
render(siteMainElement, new SortingView().element, RenderPosition.BEFOREEND);
const filmsSectionComponent = new FilmsSectionView();
render(siteMainElement, filmsSectionComponent.element, RenderPosition.BEFOREEND);

const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
render(filmsSectionComponent.element, filmsListMostCommentedComponent.element, RenderPosition.AFTERBEGIN);
let FilmsListContainerComponent = new FilmsListContainerView();
render(filmsListMostCommentedComponent.element, FilmsListContainerComponent.element, RenderPosition.BEFOREEND);
for (let i = 0; i < FilmCounter.FOR_EXTRAFILMLIST; i++) {
  renderFilmCard(FilmsListContainerComponent.element, filmsMostCommented[i]);
}

const FilmsListTopRatedComponent = new FilmsListTopRatedView();
render(filmsSectionComponent.element, FilmsListTopRatedComponent.element, RenderPosition.AFTERBEGIN);
FilmsListContainerComponent = new FilmsListContainerView();
render(FilmsListTopRatedComponent.element, FilmsListContainerComponent.element, RenderPosition.BEFOREEND);
for (let i = 0; i < FilmCounter.FOR_EXTRAFILMLIST; i++) {
  renderFilmCard(FilmsListContainerComponent.element, filmsTopRated[i]);
}

const FilmsListComponent = new FilmsListView();
render(filmsSectionComponent.element, FilmsListComponent.element, RenderPosition.AFTERBEGIN);
FilmsListContainerComponent = new FilmsListContainerView();
render(FilmsListComponent.element, FilmsListContainerComponent.element, RenderPosition.AFTERBEGIN);
for (let i = 0; i < Math.min(FilmCounter.PER_STEP, films.length); i++) {
  renderFilmCard(FilmsListContainerComponent.element, films[i]);
}


if (films.length > FilmCounter.PER_STEP) {
  let renderedFilmCount = FilmCounter.PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(FilmsListComponent.element, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

  showMoreButtonComponent.element.addEventListener(`click`, (event) => {
    event.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FilmCounter.PER_STEP)
      .forEach((film) => renderFilmCard(FilmsListContainerComponent.element, film));

    renderedFilmCount += FilmCounter.PER_STEP;
    if (renderedFilmCount > films.length) {
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}


const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FilmsAmountView().element, RenderPosition.BEFOREEND);
