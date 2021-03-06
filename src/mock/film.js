import {getRandomInteger, guid} from "../utils/common";
import {LOREM_IPSUM, FILM_GENRES} from "../consts";
import {generateComment} from "./comment";

const generateTitle = () => {
  const titles = [
    `Underwater`,
    `Knives Out`,
    `El hoyo`,
    `The Thing`,
    `Balada triste de trompeta`,
    `The Gentlemen`,
    `Jumanji`,
    `Inception`,
    `Il buono, il brutto, il cattivo`,
    `Apocalypse Now`,
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

const generateId = () => guid();

const generateRating = () => {
  return String((getRandomInteger(40, 100) / 10));
};

const generateDuration = () => {
  const durationInMinutes = getRandomInteger(30, 150);

  return durationInMinutes;
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
  const descriptionPatterns = LOREM_IPSUM.split(`.`).filter(Boolean).map((str) => `${str}. `);
  const descriptionPatternsLastIndex = descriptionPatterns.length - 1;

  const description = new Array(getRandomInteger(1, 5)).fill()
    .map(() => descriptionPatterns[getRandomInteger(0, descriptionPatternsLastIndex)]);

  const fullDescription = description.join(``).trimRight();
  const shortDescription = fullDescription.length > 140
    ? fullDescription.slice(0, 140) + `...`
    : fullDescription;

  return {fullDescription, shortDescription};
};

const generateDirector = () => {
  const directors = [
    `Christopher Nolan`,
    `Joe Johnston`,
    `John Carpenter`,
    `Rian Johnson`,
    `Francis Ford Coppola`,
    `Guy Ritchie`,
    `William Eubank`,
    `Sergio Leone`,
    `Álex de la Iglesia`,
  ];
  return directors[getRandomInteger(0, directors.length - 1)];
};

const generateWriters = () => {
  const allWriters = [
    `Christopher Nolan`,
    `Bill Lancaster`,
    `John W. Campbell Jr.`,
    `Luciano Vincenzoni`,
    `Sergio Leone`,
    `Agenore Incrocci`,
    `John Milius`,
    `Francis Ford Coppola`,
    `Michael Herr`,
    `Greg Taylor`,
    `Jim Strain`,
    `Chris Van Allsburg`,
  ];
  let writers = [];
  for (let i = 0; i < getRandomInteger(1, 3); i++) {
    const writer = allWriters[getRandomInteger(0, allWriters.length - 1)];
    if (!writers.includes(writer)) {
      writers.push(writer);
    }
  }
  return writers;
};

const generateActors = () => {
  const allActors = [
    `Leonardo DiCaprio`,
    `Joseph Gordon-Levitt`,
    `Ellen Page`,
    `Tom Hardy`,
    `Robin Williams`,
    `Clint Eastwood`,
    `Lee Van Cleef`,
    `Eli Wallach`,
    `Kristen Stewart`,
    `Vincent Cassel`,
    `Kurt Russell`,
    `Hugh Grant`,
    `Matthew McConaughey`,
    `Charlie Hunnam`,
  ];
  let actors = [];
  for (let i = 0; i < getRandomInteger(3, 5); i++) {
    const actor = allActors[getRandomInteger(0, allActors.length - 1)];
    if (!actors.includes(actor)) {
      actors.push(actor);
    }
  }
  return actors;
};

const generateCountry = () => {
  const countries = [
    `USA`,
    `Great Britain`,
    `Italy`,
    `France`,
    `Germany`,
  ];
  return countries[getRandomInteger(0, countries.length - 1)];
};

const generateAgeLimitation = () => {
  const ageLimitatins = [
    `0+`,
    `6+`,
    `12+`,
    `16+`,
    `18+`,
  ];
  return ageLimitatins[getRandomInteger(0, ageLimitatins.length - 1)];
};

const generateComments = () => {
  return new Array(getRandomInteger(1, 10)).fill().map(generateComment);
};

const generateReleaseDate = () => {
  let fromDate = new Date();
  fromDate.setFullYear(2019, 4, 0);
  fromDate.setHours(0, 0, 0, 0);

  let currentDate = new Date();
  return new Date(getRandomInteger(fromDate.getTime(), currentDate.getTime()));
};

export const generateFilm = () => {
  const {fullDescription, shortDescription} = generateDescription();

  return {
    id: generateId(),
    title: generateTitle(),
    titleOriginal: generateTitle(),
    poster: generatePoster(),
    releaseDate: generateReleaseDate(),
    raiting: generateRating(),
    duration: generateDuration(),
    genres: generateGenres(),
    fullDescription,
    shortDescription,
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    country: generateCountry(),
    ageLimitation: generateAgeLimitation(),
    comments: generateComments(),
    isWatchlisted: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
