import AbstractView from "./abstract";

const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.element.addEventListener(`click`, this._clickHandler);
  }

  _getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _clickHandler(event) {
    event.preventDefault();

    this._callback.click();
  }
}
