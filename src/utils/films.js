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
