import UserRankView from "./view/user-rank";
import SiteMenuView from "./view/site-menu";
import SortingView from "./view/sorting";
import FilmsSectionView from "./view/films-section";
import FilmsListView from "./view/films-list";
import ShowMoreButtonView from "./view/show-more-button";
import FilmsListMostCommentedView from "./view/films-list-most-commented";
import FilmsListTopRatedView from "./view/films-list-top-rated";
import {createFilmCardTemplate} from "./view/film-card";
import {createFilmsAmountTemplate} from "./view/films-amount";
import {createFilmDetailsTemplate} from "./view/film-details";
import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";
import {enumerate} from "./consts";
import {renderTemplate, renderElement, RenderPosition} from "./utils";


const films = new Array(enumerate.FILMLIST_FILM_COUNTER).fill().map(generateFilm);
const filters = generateFilter(films);
const filmsTopRated = new Array(enumerate.EXTRAFILMLIST_FILM_COUNTER).fill().map(generateFilm);
const filmsMostCommented = new Array(enumerate.EXTRAFILMLIST_FILM_COUNTER).fill().map(generateFilm);


const siteHeaderElement = document.querySelector(`.header`);
renderElement(siteHeaderElement, new UserRankView().element, RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
renderElement(siteMainElement, new SiteMenuView(filters).element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortingView().element, RenderPosition.BEFOREEND);
const filmsSectionComponent = new FilmsSectionView();
renderElement(siteMainElement, filmsSectionComponent.element, RenderPosition.BEFOREEND);

const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
renderElement(filmsSectionComponent.element, filmsListMostCommentedComponent.element, RenderPosition.AFTERBEGIN);
const filmsListMostCommentedContainer = filmsListMostCommentedComponent.element.querySelector(`.films-list__container`);
for (let i = 0; i < enumerate.EXTRAFILMLIST_FILM_COUNTER; i++) {
  renderTemplate(filmsListMostCommentedContainer, createFilmCardTemplate(filmsMostCommented[i]), `beforeend`);
}

const FilmsListTopRatedComponent = new FilmsListTopRatedView();
renderElement(filmsSectionComponent.element, FilmsListTopRatedComponent.element, RenderPosition.AFTERBEGIN);
const filmsListTopRatedContainer = FilmsListTopRatedComponent.element.querySelector(`.films-list__container`);
for (let i = 0; i < enumerate.EXTRAFILMLIST_FILM_COUNTER; i++) {
  renderTemplate(filmsListTopRatedContainer, createFilmCardTemplate(filmsTopRated[i]), `beforeend`);
}

const FilmsListComponent = new FilmsListView();
renderElement(filmsSectionComponent.element, FilmsListComponent.element, RenderPosition.AFTERBEGIN);
const filmsListContainer = FilmsListComponent.element.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(enumerate.FILM_COUNT_PER_STEP, films.length); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}


if (films.length > enumerate.FILM_COUNT_PER_STEP) {
  let renderedFilmCount = enumerate.FILM_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  renderElement(FilmsListComponent.element, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

  showMoreButtonComponent.element.addEventListener(`click`, (event) => {
    event.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + enumerate.FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += enumerate.FILM_COUNT_PER_STEP;
    if (renderedFilmCount > films.length) {
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}


const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
renderTemplate(footerStatisticsElement, createFilmsAmountTemplate(), `beforeend`);
// render(siteFooterElement, createFilmDetailsTemplate(films[0]), `afterend`);
