import UserRankView from "./view/user-rank";
import FilmsAmountView from "./view/films-amount";
import StatisticsView from "./view/statistics";
import {generateFilm} from "./mock/film"; // под удаление
import {generateFilmsAmount} from "./mock/films-amount";
import {FilmCount, MenuItem, UpdateType} from "./consts";
import {render, remove, RenderPosition} from "./utils/render";
import MovieShowcasePresenter from "./presenter/movie-showcase";
import FilterMenuPresenter from "./presenter/filter-menu";
import MoviesModel from "./model/movies";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";
import Api from "./api";

const AUTHORIZATION = `Basic $om(_rnd0m$tr1n`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const filmsWithComments = new Array(FilmCount.FOR_FILMLIST).fill().map(generateFilm); // под удаление

const commentsForModel = [];
// под удаление \/
const films = JSON.parse(JSON.stringify(filmsWithComments)); // клонирование объекта
films.forEach((film) => { // временный код, пока нет реальных данных
  film.comments =
    film.comments.reduce((accumulator, comment) => {
      comment.date = new Date(comment.date);
      commentsForModel.push(comment);
      accumulator.push(comment.id);
      return accumulator;
    }, []);
  film.releaseDate = new Date(film.releaseDate);

  return film;
});
console.log(`films for model = `, films);
// под удаление /\

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);


const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
// moviesModel.setMovies(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(commentsForModel);
const filterModel = new FilterModel();

const movieShowcasePresenter = new MovieShowcasePresenter(siteMainElement, moviesModel, filterModel, commentsModel);
const filterMenuPresenter = new FilterMenuPresenter(siteMainElement, filterModel, moviesModel);

let statisticsComponent = null;
let userRankComponent = null;

const handleFilterMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      movieShowcasePresenter.destroy();
      statisticsComponent = new StatisticsView(moviesModel.getMovies());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
    default:
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
      }
      movieShowcasePresenter.destroy();
      movieShowcasePresenter.init(siteFooterElement);
      break;
  }
};

const handleUserRankUpdate = () => {
  if (userRankComponent) {
    remove(userRankComponent);
  }

  userRankComponent = new UserRankView(moviesModel.getMovies());
  render(siteHeaderElement, userRankComponent, RenderPosition.BEFOREEND);
};

movieShowcasePresenter.init(siteFooterElement, handleUserRankUpdate);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    filterMenuPresenter.init(handleFilterMenuClick);
    render(footerStatisticsElement, new FilmsAmountView(moviesModel.getMovies()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    moviesModel.setTasks(UpdateType.INIT, []);
    filterMenuPresenter.init(handleFilterMenuClick);
    render(footerStatisticsElement, new FilmsAmountView(moviesModel.getMovies()), RenderPosition.BEFOREEND);
  });
