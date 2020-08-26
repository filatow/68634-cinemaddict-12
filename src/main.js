import UserRankView from "./view/user-rank";
import FilmsAmountView from "./view/films-amount";
import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";
import {FilmCount} from "./consts";
import {render, RenderPosition} from "./utils/render";
import MovieListPresenter from "./presenter/movie-list";


const films = new Array(FilmCount.FOR_FILMLIST).fill().map(generateFilm);
const filters = generateFilter(films);


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const movieListPresenter = new MovieListPresenter(siteMainElement, filters);


render(siteHeaderElement, new UserRankView().element, RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FilmsAmountView().element, RenderPosition.BEFOREEND);

movieListPresenter.init(films, siteFooterElement);
