import {UserRank} from "../consts";
import moment from "moment";

// export const getCurrentDate = () => new Date(new Date().setHours(23, 59, 59, 999));

export const getWatchedMovies = (movies) => movies.filter((movie) => movie.isWatched);

export const getMoviesTiming = (movies) => movies.reduce((timing, movie) => (timing += movie.duration), 0);

export const getTimingSeparation = (timing) => {
  const hours = Math.floor(timing / 60);
  const minutes = (timing - (hours * 60));

  return {hours, minutes};
};

export const getTopGenre = (movies) => {
  const Genres = new Set();
  let movieCountByGenres = {};
  let topGenre = ``;
  let topGenreMovieCount = 0;

  movies.forEach((movie) => {
    for (let genre of movie.genres) {
      if (!Genres.has(genre)) {
        Genres.add(genre);
        movieCountByGenres[genre] = 1;
      } else {
        movieCountByGenres[genre]++;
      }
    }
  });

  Genres.forEach((genre) => {
    if (movieCountByGenres[genre] > topGenreMovieCount) {
      topGenre = genre;
      topGenreMovieCount = movieCountByGenres[genre];
    }
  });

  return topGenre;
};

export const getGenres = (movies) => {
  const Genres = new Set();
  movies.forEach((movie) => {
    for (let genre of movie.genres) {
      if (!Genres.has(genre)) {
        Genres.add(genre);
      }
    }
  });

  return Array.from(Genres);
};

export const getMovieGenresStatistics = (movies) => {
  const Genres = new Set();
  let movieCountByGenres = {};

  movies.forEach((movie) => {
    for (let genre of movie.genres) {
      if (!Genres.has(genre)) {
        Genres.add(genre);
        movieCountByGenres[genre] = 1;
      } else {
        movieCountByGenres[genre]++;
      }
    }
  });

  return movieCountByGenres;
};

export const getUserRank = (watchedMoviesCount) => {
  if (watchedMoviesCount === 0) {
    return ``;
  } else if (watchedMoviesCount <= 10) {
    return UserRank.NOVICE;
  } else if (watchedMoviesCount <= 20) {
    return UserRank.FAN;
  }

  return UserRank.MOVIE_BUFF;
};

export const getMoviesReleasedBetweenDates = (movies, dateFrom, dateTo) => {
  const moviesReleasedBetweenDates = movies.filter((movie) => {
    return moment(movie.releaseDate).isBetween(dateFrom, dateTo, `day`, `[]`);
  });

  return moviesReleasedBetweenDates;
};

export const createCanvasElement = (classList) => {
  const newCanvas = document.createElement(`canvas`);
  newCanvas.classList = classList;
  newCanvas.width = 1000;

  return newCanvas;
};
