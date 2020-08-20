import {createElement} from "../utils";

const createFilmsListMostCommentedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`
  );
};

export default class FilmsListMostCommented {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createFilmsListMostCommentedTemplate();
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
