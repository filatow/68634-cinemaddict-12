export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const renderElement = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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
