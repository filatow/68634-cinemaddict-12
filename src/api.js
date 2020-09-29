import MoviesModel from "./model/movies";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint; // адрес сервера
    this._authorization = authorization; // данные для авторизации
  }

  getMovies() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((movies) => {
        // console.log(`movies from SERVER: `, movies);
        return movies.map(MoviesModel.adaptToClient);
      });
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  getComments(movies) {
    return Promise.all(
        movies.map((movie) => {
          return this._load({url: `comments/${movie.id}`})
          .then((response) => {
            return Api.toJSON(response);
          });
        })
    ).then((values) => values.flat());
  }

  // универсальный метод серверного запроса
  // объект настроек в качестве передаваемого параметра (совпадает с объектом настроек метода fetch)
  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
