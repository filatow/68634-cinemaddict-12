import AbstractView from "./abstract";

const createFilmsSectionTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsSection extends AbstractView {
  _getTemplate() {
    return createFilmsSectionTemplate();
  }
}
