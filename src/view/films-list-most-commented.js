import AbstractView from "./abstract";

const createFilmsListMostCommentedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`
  );
};

export default class FilmsListMostCommentedSection extends AbstractView {
  _getTemplate() {
    return createFilmsListMostCommentedTemplate();
  }
}
