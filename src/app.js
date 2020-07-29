import * as axios from 'axios';
import i18next from 'i18next';
import parser from './parser';
import watchState from './watchers';
import validate from './validate';
import ru from './locales/ru';

const form = document.querySelector('form');
const input = form.querySelector('input');
const button = form.querySelector('button');

const app = () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    button.textContent = i18next.t('buttonTitle');
    input.placeholder = i18next.t('inputPlaceholder');

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

      const makeRequest = (feed) => {
        const proxy = 'https://cors-anywhere.herokuapp.com/';

        axios.get(`${proxy}${feed}`)
          .then((data) => {
            watchedState.feeds = [...watchedState.feeds, parser(data.data)];
            watchedState.form.processState = 'finished';
            linksList = [...linksList, watchedState.form.rssRequest];
            watchedState.form.rssRequest = '';
          })
          .catch((err) => {
            watchedState.form.processState = 'failed';
            if (err.response) {
              console.log(err.response.status);
            }
          });
      };
      makeRequest(watchedState.form.rssRequest);
    });
  });
};

export default app;
