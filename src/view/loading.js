import AbstractView from "./abstract.js";

const createNoTaskTemplate = () => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
      </section>`
  );
};

export default class Loading extends AbstractView {
  _getTemplate() {
    return createNoTaskTemplate();
  }
}
