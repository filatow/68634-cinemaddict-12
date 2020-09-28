import moment from "moment";

export const formatFilmReleaseDate = (dueDate) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }
  return moment(dueDate).format(`DD MMMM YYYY`);
};

export const formatCommentPostDate = (dueDate) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }

  return moment(dueDate).format(`YYYY/MM/DD HH:mm`);
};

export const formatTiming = (durationInMinutes) => {
  const wholeHours = Math.floor(durationInMinutes / 60);
  return (
    wholeHours
      ? wholeHours + `h ` + (durationInMinutes - (wholeHours * 60)) + `m`
      : durationInMinutes + `m`
  );
};

export const getFilmsSortedByRating = (films) => {
  return films.slice().sort((a, b) => Number(b.raiting) - Number(a.raiting));
};

export const getFilmsSortedByCommentsAmount = (films) => {
  return films.slice().sort((a, b) => b.comments.length - a.comments.length);
};

const getWeightForNullValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }
  if (valueA === null) {
    return 1;
  }
  if (valueB === null) {
    return -1;
  }

  return null;
};

export const sortByDate = (filmA, filmB) => {
  const weight = getWeightForNullValue(filmA.releaseDate, filmB.releaseDate);
  if (weight !== null) {
    return weight;
  }

  return (filmB.releaseDate.getTime() - filmA.releaseDate.getTime());
};

export const sortByRaiting = (filmA, filmB) => {
  const weight = getWeightForNullValue(Number(filmA.raiting), Number(filmB.raiting));
  if (weight !== null) {
    return weight;
  }

  return (Number(filmB.raiting) - Number(filmA.raiting));
};
