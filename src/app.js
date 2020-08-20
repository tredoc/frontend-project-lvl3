import * as axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parse from './parser';
import watchState from './watchers';
import validate from './validate';
import ru from './locales/ru';

const UPDATE_PERIOD = 5000;

const makeRequest = (feedUrl) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  return axios.get(`${proxy}${feedUrl}`);
};

const getFeed = (event, state) => {
  event.preventDefault();
  state.form.processState = 'sending'; // eslint-disable-line

  makeRequest(state.form.rssRequest)
    .then((response) => {
      const feedObj = parse(response.data);
      const feed = feedObj.feedData;
      feed.id = Number(_.uniqueId());
      feed.url = state.form.rssRequest;
      const posts = feedObj.feedPosts.map((post) => ({ ...post, feedId: feed.id }));

      state.feeds = [...state.feeds, feed]; // eslint-disable-line
      state.posts = [...state.posts, ...posts]; // eslint-disable-line

      state.form.processState = 'finished'; // eslint-disable-line
      state.form.needUpdate = true; // eslint-disable-line
      state.form.rssRequest = ''; // eslint-disable-line
    })
    .catch((err) => {
      state.form.processState = 'failed'; // eslint-disable-line
      if (err.response) {
        console.log(err.response.status);
        state.form.processError = err.response.status; // eslint-disable-line
      }
    });
};

const updateFeed = (state, updatePeriod) => {
  if (state.needUpdate) {
    setTimeout(() => updateFeed(state, updatePeriod), updatePeriod);
    return;
  }

  const feedIds = state.feeds.map((feed) => feed.id);
  const promises = state.feeds.map((feed) => makeRequest(feed.url));
  Promise.all(promises)
    .then((data) => data.forEach((response, index) => {
      const { feedPosts } = parse(response.data);
      const postsWithId = feedPosts.map((post) => ({ ...post, feedId: feedIds[index] }));
      const diff = _.differenceWith(postsWithId, state.posts, _.isEqual);
      if (diff.length > 0) {
        state.posts = [...diff, ...state.posts]; // eslint-disable-line
      }
    }))
    .then(() => {
      setTimeout(() => updateFeed(state, updatePeriod), updatePeriod);
    });
};

const app = () => {
  const form = document.querySelector('form');
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  const userMessage = document.querySelector('.user-message');

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

    form.addEventListener('submit', (event) => getFeed(event, watchedState));
    updateFeed(watchedState, UPDATE_PERIOD);
  });
};

export default app;
