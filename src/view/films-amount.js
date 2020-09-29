import AbstractView from "./abstract";

const createFilmsAmountTemplate = (filmsAmount) => {
  return (
    `<p>${filmsAmount} movies inside</p>`
  );
};

export default class FilmsAmount extends AbstractView {
  constructor(movies) {
    super();

    this._moviesAmount = movies.length;
  }
  _getTemplate() {
    return createFilmsAmountTemplate(this._moviesAmount);
  }
}
