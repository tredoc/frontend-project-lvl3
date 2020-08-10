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
const userMessage = document.querySelector('.user-message');

const makeRequest = (feedUrl) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  return axios.get(`${proxy}${feedUrl}`);
};

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
      posts: [],
      needUpdate: false,
    };

    const watchedState = watchState(state, input, button, userMessage);
    const updatePeriod = 5000;

    input.addEventListener('input', () => {
      watchedState.form.processState = 'filling';
      watchedState.form.rssRequest = input.value.trim();

      const feedsLinksList = watchedState.feeds.map((feed) => feed.url);
      const validationErrors = validate(watchedState.form.rssRequest, feedsLinksList);

      if (validationErrors.length === 0) {
        watchedState.form.valid = true;
      } else {
        watchedState.form.valid = false;
        watchedState.form.processError = validationErrors;
      }
    });

    const getFeed = (event) => {
      event.preventDefault();
      watchedState.form.processState = 'sending';

      makeRequest(watchedState.form.rssRequest)
        .then((response) => {
          const feedObj = parse(response.data);
          const feed = feedObj.feedData;
          feed.id = Number(_.uniqueId());
          feed.url = watchedState.form.rssRequest;
          const posts = feedObj.feedPosts.map((post) => ({ ...post, feedId: feed.id }));

          watchedState.feeds = [...watchedState.feeds, feed];
          watchedState.posts = [...watchedState.posts, ...posts];

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
    };

    form.addEventListener('submit', getFeed);

    const updateFeed = () => { // не понимаю в чем профит выноса наверх
      if (watchedState.feeds.length === 0) {
        setTimeout(updateFeed, updatePeriod);
        return;
      }

      const promises = watchedState.feeds.map((feed) => makeRequest(feed.url));
      Promise.all(promises)
        .then((data) => data.forEach((response, index) => {
          const { feedPosts } = parse(response.data);
          const postsWithId = feedPosts.map((post) => ({ ...post, feedId: index + 1 }));
          const diff = _.differenceWith(postsWithId, watchedState.posts, _.isEqual);
          if (diff.length > 0) {
            watchedState.posts = [...diff, ...watchedState.posts];
          }
        }));

      setTimeout(updateFeed, updatePeriod);
    };
    updateFeed(watchedState, updatePeriod);
  });
};

export default app;
