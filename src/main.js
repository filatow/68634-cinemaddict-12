import FilterMenuView from "./view/filter-menu";
import UserRankView from "./view/user-rank";
import FilmsAmountView from "./view/films-amount";
import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";
import {generateFilmsAmount} from "./mock/films-amount";
import {FilmCount} from "./consts";
import {render, RenderPosition} from "./utils/render";
import MovieListPresenter from "./presenter/movie-list";
import MoviesModel from "./model/movies";


const films = new Array(FilmCount.FOR_FILMLIST).fill().map(generateFilm);
const filters = generateFilter(films);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);


const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel);


render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FilmsAmountView(generateFilmsAmount()), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterMenuView(filters), RenderPosition.BEFOREEND);


movieListPresenter.init(films, siteFooterElement);
