import FilterMenuView from "../view/filter-menu";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {filter} from "../utils/filter";
import {FilterType, UpdateType} from "../consts";

export default class FilterMenu {
  constructor(filterMenuContainer, filterModel, moviesModel) {
    this._filterMenuContainer = filterMenuContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._currentFilterType = null;

    this._filterMenuComponent = null;
    this._handleFilterMenuClick = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(handleFilterMenuClick) {
    if (handleFilterMenuClick) {
      this._handleFilterMenuClick = handleFilterMenuClick;
    }
    this._currentFilterType = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterMenuComponent = this._filterMenuComponent;

    this._filterMenuComponent = new FilterMenuView(filters, this._currentFilterType);
    this._filterMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    if (this._handleFilterMenuClick !== null) {
      this._filterMenuComponent.setFilterMenuClickHandler(this._handleFilterMenuClick);
    }

    if (prevFilterMenuComponent === null) {
      render(this._filterMenuContainer, this._filterMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterMenuComponent, prevFilterMenuComponent);
    remove(prevFilterMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](movies).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](movies).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](movies).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](movies).length
      }
    ];
  }

}
