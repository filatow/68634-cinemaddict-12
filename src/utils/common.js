export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isEscKeyPressed = (event) => {
  return (event.key === `Escape` || event.key === `Esc`);
};

export const isEnterKeyPressed = (event) => {
  return (event.key === `Enter`);
};

export const isCtrlKeyPressed = (event) => {
  return (event.key === `Control`);
};

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];

};
