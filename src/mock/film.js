import {getRandomInteger} from "../utils.js";
import {LOREM_IPSUM, FILM_GENRES} from "../const.js";

const generateTitle = () => {
  const titles = [
    `Под водой`,
    `Достать ножи`,
    `Платформа`,
    `Нечто`,
    `Печальная баллада для трубы`,
    `Джентльмены`,
    `Джуманджи`,
    `Начало`,
    `Хороший, плохой, злой`,
    `Апокалипсис сегодня`,
  ];
  return titles[getRandomInteger(0, titles.length - 1)];
};

const generatePoster = () => {
  const posters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`,
  ];
  return `images/posters/` + posters[getRandomInteger(0, posters.length - 1)];
};

const generateRating = () => {
  return String((getRandomInteger(40, 100) / 10));
};

const generateDuration = () => {
  const durationInMinutes = getRandomInteger(30, 150);
  const wholeHours = Math.floor(durationInMinutes / 60);
  return (
    wholeHours
      ? wholeHours + `h ` + (durationInMinutes - (wholeHours * 60)) + `m`
      : durationInMinutes + `m`
  );
};

const generateGenres = () => {
  let genres = [];
  for (let i = 0; i < getRandomInteger(1, 3); i++) {
    const genre = FILM_GENRES[getRandomInteger(0, FILM_GENRES.length - 1)];
    if (!genres.includes(genre)) {
      genres.push(genre);
    }
  }
  return genres;
};

const generateDescription = () => {
  let descriptionPatterns = LOREM_IPSUM.split(`.`);
  descriptionPatterns = descriptionPatterns
    .map((element) => element.trim())
    .filter((element) => Boolean(element));

  let descriptionPhrases = [];
  const phrasesCount = getRandomInteger(1, 5);
  for (let i = 0; i < phrasesCount; i++) {
    descriptionPhrases.push(descriptionPatterns[getRandomInteger(0, descriptionPatterns.length - 1)]);
  }

  return descriptionPhrases.reduce((description, phrase, phraseIndex) => {
    return phraseIndex !== phrasesCount - 1
      ? description + `. ` + phrase
      : description + `. ` + phrase + `.`;
  });
};

const generateComments = () => {
  return [];
};

export const generateFilm = () => {
  const productionYear = String(getRandomInteger(1979, 2020));

  return {
    title: generateTitle(),
    poster: generatePoster(),
    productionYear,
    raiting: generateRating(),
    duration: generateDuration(),
    genres: generateGenres(),
    description: generateDescription(),
    comments: generateComments(),
    isWatchlisted: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
