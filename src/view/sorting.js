import AbstractView from "./abstract";
import {SortType} from "../consts";

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" date-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" date-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" date-sort-type="${SortType.RAITING}">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sorting extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createSortingTemplate();
  }

  _sortTypeChangeHandler(event) {
    if (event.target.tagName !== `A`) {
      return;
    }

    event.preventDefault();
    this._callback.sortTypeChange();
  }

  setSortChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
