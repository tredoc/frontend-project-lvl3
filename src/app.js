import * as axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parse from './parser';
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
      },
      feeds: [],
      links: [],
      needUpdate: false,
    };

    const watchedState = watchState(state);

    input.addEventListener('input', () => {
      watchedState.form.processState = 'filling';
      watchedState.form.rssRequest = input.value.trim();

      const feedsLinksList = watchedState.feeds.map((feed) => feed.link);
      const validationErrors = validate(watchedState.form.rssRequest, feedsLinksList);

      if (!validationErrors.length) {
        watchedState.form.valid = true;
      } else {
        watchedState.form.valid = false;
        watchedState.form.processError = validationErrors;
      }
    });

    const makeRequest = (feedUrl) => {
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      return axios.get(`${proxy}${feedUrl}`);
    };

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      watchedState.form.processState = 'sending';

      makeRequest(watchedState.form.rssRequest)
        .then((response) => {
          const feedObj = parse(response.data);
          const feed = feedObj.feedData;
          feed.id = _.uniqueId();
          feed.url = watchedState.form.rssRequest;

          const links = feedObj.feedLinks.map((link) => ({ ...link, feedId: feed.id }));
          console.log('LINKS ', links);
          watchedState.feeds = [...watchedState.feeds, feed];
          watchedState.links = [...watchedState.links, ...links];

          watchedState.form.processState = 'finished';
          watchedState.form.needUpdate = true;
          watchedState.form.rssRequest = '';
        })
        .catch((err) => {
          watchedState.form.processState = 'failed';
          if (err.response) {
            console.log(err.response.status);
          }
        });
    });

    const updateFeed = () => {
      if (!watchedState.feeds.length) {
        setTimeout(updateFeed, 5000);
        return;
      }

      watchedState.feeds.forEach((feed) => {
        const watchedLinks = watchedState.links.map((link) => link.title);
        makeRequest(feed.url)
          .then((response) => parse(response.data))
          .then((updFeed) => {
            const { feedLinks } = updFeed;
            const filtered = feedLinks.filter((link) => !watchedLinks.includes(link.title));
            if (filtered.length) {
              const linksWithId = feedLinks.map((link) => ({ ...link, feedId: feed.id }));
              watchedState.links = [...watchedState.links, ...linksWithId];
            }
          });
      });
      console.log('no changes, restart timer');
      setTimeout(updateFeed, 5000);
    };
    updateFeed();
  });
};

export default app;
