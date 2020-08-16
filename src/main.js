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
import {generateFilter} from "./mock/filter.js";

const FILMLIST_FILM_COUNTER = 17;
const EXTRAFILMLIST_FILM_COUNTER = 2;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILMLIST_FILM_COUNTER).fill().map(generateFilm);
const filters = generateFilter(films);
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
render(siteMainElement, createSiteMenuTemplate(filters), `beforeend`);
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
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(FILM_COUNT_PER_STEP, films.length); i++) {
  render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}


if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
  const showMoreButton = document.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (event) => {
    event.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += FILM_COUNT_PER_STEP;
    if (renderedFilmCount > films.length) {
      showMoreButton.remove();
    }
  });
}


const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsAmountTemplate(), `beforeend`);
// render(siteFooterElement, createFilmDetailsTemplate(films[0]), `afterend`);
