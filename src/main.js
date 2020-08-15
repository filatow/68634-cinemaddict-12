import {createUserRankTemplate} from "./view/user-rank.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createFilmsTemplate} from "./view/films.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmsListTopRatedTemplate} from "./view/films-list-top-rated.js";
import {createFilmsListMostCommentedTemplate} from "./view/films-list-most-commented.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";
import {generateFilm} from "./mock/film.js";

const FILMLIST_FILM_COUNTER = 5;
const EXTRAFILMLIST_FILM_COUNTER = 2;

const films = new Array(FILMLIST_FILM_COUNTER).fill().map(generateFilm);
const filmsTopRated = new Array(EXTRAFILMLIST_FILM_COUNTER).fill().map(generateFilm);
const filmsMostCommented = new Array(EXTRAFILMLIST_FILM_COUNTER).fill().map(generateFilm);


const createFilmsAmountTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createUserRankTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);

render(filmsElement, createFilmsListMostCommentedTemplate(), `afterbegin`);
const filmsListMostCommented = filmsElement.querySelector(`.films-list--extra`);
const filmsListMostCommentedContainer = filmsListMostCommented.querySelector(`.films-list__container`);
for (let i = 0; i < EXTRAFILMLIST_FILM_COUNTER; i++) {
  render(filmsListMostCommentedContainer, createFilmCardTemplate(filmsMostCommented[i]), `beforeend`);
}

render(filmsElement, createFilmsListTopRatedTemplate(), `afterbegin`);
const filmsListTopRated = filmsElement.querySelector(`.films-list--extra`);
const filmsListTopRatedContainer = filmsListTopRated.querySelector(`.films-list__container`);
for (let i = 0; i < EXTRAFILMLIST_FILM_COUNTER; i++) {
  render(filmsListTopRatedContainer, createFilmCardTemplate(filmsTopRated[i]), `beforeend`);
}

render(filmsElement, createFilmsListTemplate(), `afterbegin`);

const filmsList = filmsElement.querySelector(`.films-list`);
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);

const filmsListContainer = filmsList.querySelector(`.films-list__container`);
for (let i = 0; i < FILMLIST_FILM_COUNTER; i++) {
  render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}

const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsAmountTemplate(), `beforeend`);
// render(siteFooterElement, createFilmDetailsTemplate(), `afterend`);
