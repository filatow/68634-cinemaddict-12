const createFilterTemplate = (filter, index) => {
  const {name, count} = filter;
  const label = name.substring(0, 1).toUpperCase() + name.substring(1);

  return index !== 0
    ? `<a href="#${name}" class="main-navigation__item">${label} <span class="main-navigation__item-count">${count}</span></a>`
    : `<a href="#${name}" class="main-navigation__item main-navigation__item--active">All movies</a>`;
};

export const createSiteMenuTemplate = (filters) => {

  const filtersTemplate = filters
    .map((filter, index) => createFilterTemplate(filter, index))
    .join(``);

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filtersTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};
