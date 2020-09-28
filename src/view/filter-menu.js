import AbstractView from "./abstract";
import {FilterType, MenuItem} from "../consts";

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${type}"
      class="main-navigation__item ${type === currentFilterType ? `main-navigation__item--active` : ``}"
      data-type="${type}"
      data-menu-item="filter-${type}">
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
    <a href="#stats" class="main-navigation__additional"
    data-menu-item="statistics">Stats</a>
  </nav>`
  );
};

export default class FilterMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._filterMenuClickHandler = this._filterMenuClickHandler.bind(this);
  }

  _getTemplate() {
    return createFilterMenuTemplate(this._filters, this._currentFilterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(event) {
    event.preventDefault();
    if (event.target.dataset.type) {
      this._callback.filterTypeChange(event.target.dataset.type);
    }
  }

  setFilterMenuClickHandler(callback) {
    this._callback.filterMenuClick = callback;
    this.element.addEventListener(`click`, this._filterMenuClickHandler);
  }

  _filterMenuClickHandler(event) {
    event.preventDefault();
    if (event.target.dataset.menuItem) {
      this._callback.filterMenuClick(event.target.dataset.menuItem);
    }

    if (event.target.dataset.menuItem === MenuItem.STATISTICS) {
      this.element.querySelectorAll(`.main-navigation__item`)
        .forEach((elem) => {
          elem.classList.remove(`main-navigation__item--active`);
        });
      event.target.classList.add(`main-navigation__item--active`);
    }
  }

  // setMenuItem(menuItem) {
  //   const item = this.element.querySelector(`[data-menu-item=${menuItem}]`);

  //   if (item !== null) {
  //     item.classList.add(`main-navigation__item--active`);
  //   }
  // }
}
