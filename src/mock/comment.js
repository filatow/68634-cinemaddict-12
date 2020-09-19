import {getRandomInteger, guid} from "../utils/common";

const generateId = () => guid();

const generateEmoji = () => {
  const emojiSources = [
    `angry.png`,
    `puke.png`,
    `sleeping.png`,
    `smile.png`,
  ];
  return `images/emoji/` + emojiSources[getRandomInteger(0, emojiSources.length - 1)];
};

const generateAuthor = () => {
  const authors = [
    `night_driver`,
    `NotFoundUser`,
    `cinemaniac`,
    `thatFRUIT`,
    `Eugene_2000`,
    `I_own_the_top`,
    `twister`,
    `Mr. Smith`,
    `cookie monster`,
  ];
  return authors[getRandomInteger(0, authors.length - 1)];
};

const generateMessage = () => {
  const messages = [
    `There's not much that makes it a 'Must-See' movie`,
    `This was a violent, miserable experience that only got worse the further it went.`,
    `This could not have come at a better time...`,
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
    `I was surprised at how much I enjoyed this`,
    `It was everything I hoped for and more.`,
  ];
  return messages[getRandomInteger(0, messages.length - 1)];
};

const generateDate = () => {
  let fromDate = new Date();
  fromDate.setFullYear(2020, 4, 1);
  let currentDate = new Date();

  return new Date(getRandomInteger(fromDate.getTime(), currentDate.getTime()));
};

export const generateComment = () => {
  return {
    id: generateId(),
    emoji: generateEmoji(),
    date: generateDate(),
    author: generateAuthor(),
    message: generateMessage(),
  };
};
