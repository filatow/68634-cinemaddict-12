import AbstractView from "./abstract";
import {getWatchedMovies, getUserRank} from "../utils/statistics";

const createUserRankTemplate = (watchedMoviesCount) => {
  const userRank = getUserRank(watchedMoviesCount);

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserRank extends AbstractView {
  constructor(movies) {
    super();

    this._movies = movies;
  }

  _getTemplate() {
    const watchedMovies = getWatchedMovies(this._movies);
    const watchedMoviesCount = watchedMovies.length;
    return createUserRankTemplate(watchedMoviesCount);
  }
}
