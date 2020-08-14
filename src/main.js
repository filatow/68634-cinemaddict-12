import {createUserRankTemplate} from "./view/user-rank.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createFilmsTemplate} from "./view/films.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmsListExtraTemplate} from "./view/films-list-extra.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";
import {generateFilm} from "./mock/film.js";

const EXTRAFILMLIST_COUNTER = 2;
const EXTRAFILMLIST_FILM_COUNTER = 2;
const FILMLIST_FILM_COUNTER = 5;


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

for (let i = 0; i < EXTRAFILMLIST_COUNTER; i++) {
  render(filmsElement, createFilmsListExtraTemplate(), `afterbegin`);
  const filmsListExtra = filmsElement.querySelector(`.films-list--extra`);
  const filmsListExtraContainer = filmsListExtra.querySelector(`.films-list__container`);
  for (let j = 0; j < EXTRAFILMLIST_FILM_COUNTER; j++) {
    render(filmsListExtraContainer, createFilmCardTemplate(), `beforeend`);
  }
}

render(filmsElement, createFilmsListTemplate(), `afterbegin`);

const filmsList = filmsElement.querySelector(`.films-list`);
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);

const filmsListContainer = filmsList.querySelector(`.films-list__container`);
for (let i = 0; i < FILMLIST_FILM_COUNTER; i++) {
  render(filmsListContainer, createFilmCardTemplate(), `beforeend`);
}

const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsAmountTemplate(), `beforeend`);
render(siteFooterElement, createFilmDetailsTemplate(), `afterend`);
