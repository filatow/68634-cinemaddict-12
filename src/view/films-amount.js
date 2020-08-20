import {getRandomInteger, createElement} from "../utils";

let filmsAmount = getRandomInteger(50000, 200000);
filmsAmount = `${Math.floor(filmsAmount / 1000)} ${Math.floor(filmsAmount % 1000)}`;

const createFilmsAmountTemplate = () => {
  return (
    `<p>${filmsAmount} movies inside</p>`
  );
};

export default class FilmsAmount {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createFilmsAmountTemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
