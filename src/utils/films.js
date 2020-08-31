export const humanizeFilmReleaseDate = (dueDate) => {
  return dueDate.toLocaleString(`en-GB`, {day: `2-digit`, month: `long`, year: `numeric`});
};

export const humanizeCommentPostDate = (dueDate) => {
  const year = dueDate.getFullYear();
  const month = dueDate.getMonth();
  const date = dueDate.getDate();
  const hours = dueDate.getHours();
  const minutes = dueDate.getMinutes();

  return `${year}/${month}/${date} ${hours}:${minutes}`;
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
