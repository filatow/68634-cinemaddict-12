import AbstractView from "./abstract";

const createFilmsAmountTemplate = (filmsAmount) => {
  return (
    `<p>${filmsAmount} movies inside</p>`
  );
};

export default class FilmsAmount extends AbstractView {
  constructor(filmsAmount) {
    super();
    this._filmsAmount = filmsAmount;
  }
  _getTemplate() {
    return createFilmsAmountTemplate(this._filmsAmount);
  }
}
