export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const guid = () => {
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
    .replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0; let v = c === `x` ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
