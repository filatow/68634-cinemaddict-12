import AbstractView from "./abstract";
import {
  getWatchedMovies,
  getMoviesTiming,
  getTimingSeparation,
  getTopGenre,
  getUserRank,
  getGenres,
  getMovieGenresStatistics,
  getMoviesReleasedBetweenDates,
  createCanvasElement} from "../utils/statistics";
import {FIRST_FILM_EVER_RELEASE_DATE, ReleasingPeriod} from "../consts";
import {replace, createElement} from "../utils/render";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const createSummaryTemplate = (data) => {
  const {movies, dateFrom, dateTo} = data;
  const watchedMovies = getMoviesReleasedBetweenDates(
      getWatchedMovies(movies), dateFrom, dateTo);
  const watchedMoviesCount = watchedMovies.length;
  const watchedMoviesTiming = getMoviesTiming(watchedMovies);
  const {hours, minutes} = getTimingSeparation(watchedMoviesTiming);
  const topGenre = getTopGenre(watchedMovies);
  return (
    `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMoviesCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>`
  );
};

const createStatisticsTemplate = (data) => {
  const {movies, dateFrom, dateTo} = data;
  const watchedMovies = getMoviesReleasedBetweenDates(
      getWatchedMovies(movies), dateFrom, dateTo);
  const watchedMoviesCount = watchedMovies.length;
  const userRank = getUserRank(watchedMoviesCount);
  const statisticRank = (userRank) ?
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>` : ``;
  const summaryTemplate = createSummaryTemplate(data);

  return (
    `<section class="statistic">
    ${statisticRank}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    ${summaryTemplate}

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width=1000></canvas>
    </div>

  </section>`
  );
};

const renderChart = (statisticCtx, data) => {
  const BAR_HEIGHT = 50;

  const {movies, dateFrom, dateTo} = data;
  const watchedMovies = getMoviesReleasedBetweenDates(
      getWatchedMovies(movies),
      dateFrom,
      dateTo);
  const genres = getGenres(watchedMovies);

  statisticCtx.height = BAR_HEIGHT * genres.length;

  const movieGenresStatistics = getMovieGenresStatistics(watchedMovies);
  const movieAmountsByGenres = genres.map((genre) => movieGenresStatistics[genre]);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres, // жанры
      datasets: [{
        data: movieAmountsByGenres, // количество фильмов по жанрам
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

export default class Statistics extends AbstractView {
  constructor(movies) {
    super();

    this._data = {
      movies,
      dateFrom: FIRST_FILM_EVER_RELEASE_DATE,
      dateTo: new Date(),
    };

    this._statisticCtx = this.element.querySelector(`.statistic__chart`);
    this._chart = null;

    this._handlePeriodChange = this._handlePeriodChange.bind(this);
    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setChart();
    this._setPeriodChangeHandler();
  }

  removeElement() {
    super.removeElement();

    if (this._chart !== null) {
      this._chart = null;
    }
  }

  _setPeriodChangeHandler() {
    this.element.querySelectorAll(`[name="statistic-filter"]`)
      .forEach((elem) => {
        elem.addEventListener(`change`, this._periodChangeHandler);
      });
  }

  _getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  _refreshSummary() {
    let oldSummaryElement = this.element.querySelector(`.statistic__text-list`);
    const newSummaryElement = createElement(createSummaryTemplate(this._data));
    replace(newSummaryElement, oldSummaryElement);
    oldSummaryElement = null;
  }

  _periodChangeHandler(event) {
    event.preventDefault();
    const today = new Date();
    switch (event.target.value) {
      case ReleasingPeriod.ALL_TIME:
        this._handlePeriodChange(FIRST_FILM_EVER_RELEASE_DATE, today);
        break;
      case ReleasingPeriod.TODAY:
        this._handlePeriodChange(today, today);
        break;
      case ReleasingPeriod.WEEK:
        this._handlePeriodChange((() => {
          const daysToFullWeek = 6;
          const date = new Date();
          date.setDate(date.getDate() - daysToFullWeek);
          return date;
        })(), today);
        break;
      case ReleasingPeriod.MONTH:
        this._handlePeriodChange((() => {
          const daysToFullMonth = 30;
          const date = new Date();
          date.setDate(date.getDate() - daysToFullMonth);
          return date;
        })(), today);
        break;
      case ReleasingPeriod.YEAR:
        this._handlePeriodChange((() => {
          const daysToFullYear = 364;
          const date = new Date();
          date.setDate(date.getDate() - daysToFullYear);
          return date;
        })(), today);
        break;
    }

    this._refreshSummary();
    this._setChart();
  }

  _handlePeriodChange(dateFrom, dateTo) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this._data.dateFrom = dateFrom;
    this._data.dateTo = dateTo;
  }

  _refreshChartCanvas() {
    let oldStatisticCtx = this._statisticCtx;
    this._statisticCtx = createCanvasElement([`statistic__chart`]);
    replace(this._statisticCtx, oldStatisticCtx);
    oldStatisticCtx = null;
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
      this._refreshChartCanvas();
    }

    this._chart = renderChart(this._statisticCtx, this._data);
  }
}
