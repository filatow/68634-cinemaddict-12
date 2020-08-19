import UserRankView from "./view/user-rank";
import SiteMenuView from "./view/site-menu";
import {createSortingTemplate} from "./view/sorting";
import {createFilmsTemplate} from "./view/films";
import {createFilmsListTemplate} from "./view/films-list";
import {createShowMoreButtonTemplate} from "./view/show-more-button";
import {createFilmsListTopRatedTemplate} from "./view/films-list-top-rated";
import {createFilmsListMostCommentedTemplate} from "./view/films-list-most-commented";
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
renderTemplate(siteMainElement, createSortingTemplate(), `beforeend`);
renderTemplate(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);

renderTemplate(filmsElement, createFilmsListMostCommentedTemplate(), `afterbegin`);
const filmsListMostCommented = filmsElement.querySelector(`.films-list--extra`);
const filmsListMostCommentedContainer = filmsListMostCommented.querySelector(`.films-list__container`);
for (let i = 0; i < enumerate.EXTRAFILMLIST_FILM_COUNTER; i++) {
  renderTemplate(filmsListMostCommentedContainer, createFilmCardTemplate(filmsMostCommented[i]), `beforeend`);
}

renderTemplate(filmsElement, createFilmsListTopRatedTemplate(), `afterbegin`);
const filmsListTopRated = filmsElement.querySelector(`.films-list--extra`);
const filmsListTopRatedContainer = filmsListTopRated.querySelector(`.films-list__container`);
for (let i = 0; i < enumerate.EXTRAFILMLIST_FILM_COUNTER; i++) {
  renderTemplate(filmsListTopRatedContainer, createFilmCardTemplate(filmsTopRated[i]), `beforeend`);
}

renderTemplate(filmsElement, createFilmsListTemplate(), `afterbegin`);

const filmsList = filmsElement.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(enumerate.FILM_COUNT_PER_STEP, films.length); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}


if (films.length > enumerate.FILM_COUNT_PER_STEP) {
  let renderedFilmCount = enumerate.FILM_COUNT_PER_STEP;

  renderTemplate(filmsList, createShowMoreButtonTemplate(), `beforeend`);
  const showMoreButton = document.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (event) => {
    event.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + enumerate.FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += enumerate.FILM_COUNT_PER_STEP;
    if (renderedFilmCount > films.length) {
      showMoreButton.remove();
    }
  });
}


const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
renderTemplate(footerStatisticsElement, createFilmsAmountTemplate(), `beforeend`);
// render(siteFooterElement, createFilmDetailsTemplate(films[0]), `afterend`);
