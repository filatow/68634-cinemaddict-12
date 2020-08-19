import {createElement} from "../utils";

const createFilmsListTopRatedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container">
    </div>
  </section>`
  );
};

export default class FilmsListTopRated {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createFilmsListTopRatedTemplate();
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
