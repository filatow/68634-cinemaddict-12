import AbstractView from "./abstract";
import {getRandomInteger} from "../utils/common";

let filmsAmount = getRandomInteger(50000, 200000);
filmsAmount = `${Math.floor(filmsAmount / 1000)} ${Math.floor(filmsAmount % 1000)}`;

const createFilmsAmountTemplate = () => {
  return (
    `<p>${filmsAmount} movies inside</p>`
  );
};

export default class FilmsAmount extends AbstractView {
  _getTemplate() {
    return createFilmsAmountTemplate();
  }
}
