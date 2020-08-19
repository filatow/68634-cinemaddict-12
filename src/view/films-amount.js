import {getRandomInteger} from "../utils";

let filmsAmount = getRandomInteger(50000, 200000);
filmsAmount = `${Math.floor(filmsAmount / 1000)} ${Math.floor(filmsAmount % 1000)}`;

export const createFilmsAmountTemplate = () => {
  return (
    `<p>${filmsAmount} movies inside</p>`
  );
};
