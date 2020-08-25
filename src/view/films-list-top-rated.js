import AbstractView from "./abstract";

const createFilmsListTopRatedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`
  );
};

export default class FilmsListTopRated extends AbstractView {
  _getTemplate() {
    return createFilmsListTopRatedTemplate();
  }
}
