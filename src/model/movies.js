/* eslint-disable camelcase */
import Observer from "../utils/observer";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        {
          id: movie.id,
          comments: movie.comments,
          actors: movie.film_info.actors,
          ageLimitation: `${movie.film_info.age_rating}+`,
          country: movie.film_info.release.release_country,
          director: movie.film_info.director,
          duration: movie.film_info.runtime,
          fullDescription: movie.film_info.description,
          genres: movie.film_info.genre,
          isFavorite: movie.user_details.favorite,
          isWatched: movie.user_details.already_watched,
          isWatchlisted: movie.user_details.watchlist,
          watchingDate: movie.user_details.watching_date !== null // добавить учет в статистике
            ? new Date(movie.user_details.watching_date)
            : movie.user_details.watching_date,
          poster: movie.film_info.poster,
          raiting: String(movie.film_info.total_rating),
          releaseDate: new Date(movie.film_info.release.date),
          shortDescription: movie.film_info.description.length > 140
            ? movie.film_info.description.slice(0, 140) + `...`
            : movie.film_info.description,
          title: movie.film_info.title,
          titleOriginal: movie.film_info.alternative_title,
          writers: movie.film_info.writers,
        }
    );

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        {
          comments: movie.comments,
          id: movie.id,
          film_info: {
            title: movie.title,
            alternative_title: movie.titleOriginal,
            total_rating: Number(movie.raiting),
            poster: movie.poster,
            age_rating: Number.parseInt(movie.ageLimitation, 10),
            director: movie.director,
            writers: movie.writers,
            actors: movie.actors,
            release: {
              date: movie.releaseDate.toJSON(),
              release_country: movie.country
            },
            runtime: movie.duration,
            genre: movie.genres,
            description: movie.fullDescription
          },
          user_details: {
            watchlist: movie.isWatchlisted,
            already_watched: movie.isWatched,
            watching_date: (() => {
              if (movie.isWatched) {
                return (movie.watchingDate !== null
                  ? movie.watchingDate
                  : new Date()).toJSON();
              }
              return null;
            })(),
            favorite: movie.isFavorite,
          }
        }
    );
    // console.log(`adaptedMovie to PUT: `, adaptedMovie);


    return adaptedMovie;
  }
}
