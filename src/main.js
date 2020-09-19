import FilterMenuView from "./view/filter-menu";
import UserRankView from "./view/user-rank";
import FilmsAmountView from "./view/films-amount";
import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";
import {generateFilmsAmount} from "./mock/films-amount";
import {FilmCount} from "./consts";
import {render, RenderPosition} from "./utils/render";
import MovieShowcasePresenter from "./presenter/movie-showcase";
import MoviesModel from "./model/movies";
import CommentsModel from "./model/comments";


const filmsWithComments = new Array(FilmCount.FOR_FILMLIST).fill().map(generateFilm);
const filters = generateFilter(filmsWithComments);

const commentsForModel = [];
const films = JSON.parse(JSON.stringify(filmsWithComments)); // глубокое клонирование объекта
films.forEach((film) => {
  film.comments =
    film.comments.reduce((accumulator, comment) => {
      commentsForModel.push(comment);
      accumulator.push(comment.id);
      return accumulator;
    }, []);

  return film;
});

const moviesModel = new MoviesModel();
moviesModel.setMovies(filmsWithComments);
const commentsModel = new CommentsModel();
commentsModel.setComments(commentsForModel);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);


const movieListPresenter = new MovieShowcasePresenter(siteMainElement, moviesModel, commentsModel);


render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FilmsAmountView(generateFilmsAmount()), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterMenuView(filters), RenderPosition.BEFOREEND);


movieListPresenter.init(siteFooterElement);
