import AbstractView from "./abstract";
import {SortType} from "../consts";

const createSortingTemplate = (selectedSortType) => {
  let activeDefaultSortType = ``;
  let activeDateSortType = ``;
  let activeRaitingSortType = ``;
  switch (selectedSortType) {
    case SortType.DEFAULT:
      activeDefaultSortType = `sort__button--active`;
      break;
    case SortType.DATE:
      activeDateSortType = `sort__button--active`;
      break;
    case SortType.RAITING:
      activeRaitingSortType = `sort__button--active`;
      break;
  }
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button ${activeDefaultSortType}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${activeDateSortType}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${activeRaitingSortType}" data-sort-type="${SortType.RAITING}">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sorting extends AbstractView {
  constructor(currentSortType = SortType.DEFAULT) {
    super();
    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  setSortChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(event) {
    if (event.target.tagName !== `A`) {
      return;
    }

    event.preventDefault();
    this._callback.sortTypeChange(event.target.dataset.sortType);
  }
}
