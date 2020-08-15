import {getRandomInteger} from "../utils.js";
import {LOREM_IPSUM, FILM_GENRES} from "../const.js";

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
  return directors[getRandomInteger(0, directors.length)];
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
  return [];
};

const generateReleaseDate = () => {
  let fromDate = new Date();
  fromDate.setFullYear(1980, 0, 1);
  fromDate.setHours(0, 0, 0, 0);

  let currentDate = new Date();
  return new Date(getRandomInteger(fromDate.getTime(), currentDate.getTime()));
};

export const generateFilm = () => {

  return {
    title: generateTitle(),
    poster: generatePoster(),
    releaseDate: generateReleaseDate(),
    raiting: generateRating(),
    duration: generateDuration(),
    genres: generateGenres(),
    description: generateDescription(),
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
