import {getRandomInteger} from "../utils/common";

let filmsAmount = getRandomInteger(50000, 200000);
filmsAmount = `${Math.floor(filmsAmount / 1000)} ${Math.floor(filmsAmount % 1000)}`;

export const generateFilmsAmount = () => {
  return filmsAmount;
};
