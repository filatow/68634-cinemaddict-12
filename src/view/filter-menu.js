import AbstractView from "./abstract";
import {FilterType} from "../consts";

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${type}"
      class="main-navigation__item ${type === currentFilterType ? `main-navigation__item--active` : ``}"
      data-type="${type}">
      ${name}
      ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterMenuTemplate = (filters, currentFilterType) => {

  const filtersTemplate = filters
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filtersTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class FilterMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createFilterMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(event) {
    event.preventDefault();
    if (event.target.dataset.type) {
      this._callback.filterTypeChange(event.target.dataset.type);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
