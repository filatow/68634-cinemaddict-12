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
  _getTemplate() {
    return createSortingTemplate();
  }
}
