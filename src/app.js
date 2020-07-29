import * as axios from 'axios';
import parser from './parser';
import watchState from './watchers';
import validate from './validate';

const form = document.querySelector('form');
const input = form.querySelector('input');

const app = () => {
  const state = {
    form: {
      processState: 'filling', // filling, sending, finished, failed
      processError: null,
      rssRequest: '',
      valid: true,
      errors: {},
    },
    feeds: [],
  };

  const watchedState = watchState(state);
  let linksList = [];

  input.addEventListener('input', () => {
    watchedState.form.processState = 'filling';
    watchedState.form.rssRequest = input.value;

    const validationErrors = validate(watchedState.form.rssRequest, linksList);

    if (!validationErrors.length) {
      watchedState.form.valid = true;
    } else {
      watchedState.form.valid = false;
      watchedState.form.processError = validationErrors;
    }
    console.log(state);
  });

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    watchedState.form.processState = 'sending';

    axios.get(`https://cors-anywhere.herokuapp.com/${watchedState.form.rssRequest}`)
      .then((data) => {
        watchedState.feeds = [...watchedState.feeds, parser(data.data)];
        watchedState.form.processState = 'finished';
        linksList = [...linksList, watchedState.form.rssRequest];
        watchedState.form.rssRequest = '';
      })
      .catch((err) => {
        watchedState.form.errors = err;
        watchedState.form.status = 'failed';
        if (err.request) {
          console.log(new Error(err.request));
        }
      });
  });
};

export default app;
