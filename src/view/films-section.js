import {createElement} from "../utils";

const createFilmsSectionTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsSection {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createFilmsSectionTemplate();
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
