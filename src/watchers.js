import onChange from 'on-change';
import i18next from 'i18next';
import { renderFeed, renderLinks } from './renders';

const form = document.querySelector('form');
const input = form.querySelector('input');
const button = form.querySelector('button');
const userMessage = document.querySelector('.user-message');

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.valid') {
      if (value === true) {
        input.classList.remove('input-warning');
        userMessage.textContent = i18next.t('errors.valid');
        userMessage.style.color = 'green';
        button.disabled = false;
      } else {
        input.classList.add('input-warning');
        button.disabled = true;
      }
    }

    if (path === 'form.processError') {
      if (value.length) {
        userMessage.textContent = i18next.t(`errors.${[value[0].type]}`);
        userMessage.style.color = 'red';
      }
    }

    if (path === 'form.processState') {
      switch (watchedState.form.processState) {
        case 'filling':
          console.log('form filling!');
          button.disabled = false;
          break;
        case 'sending':
          console.log('form is sending!');
          button.disabled = true;
          userMessage.textContent = i18next.t('statuses.sending');
          userMessage.style.color = '#007bff';
          break;
        case 'finished':
          console.log('finished!');
          button.disabled = false;
          input.value = '';
          userMessage.textContent = i18next.t('statuses.ready');
          userMessage.style.color = '#25a925';
          break;
        case 'failed':
          console.log('failed');
          userMessage.textContent = i18next.t('statuses.failed');
          userMessage.style.color = 'red';
          break;
        default:
          console.log('unknown state');
      }
    }

    if (path === 'feeds') {
      renderFeed(watchedState.feeds, '.rss-links');
      console.log('first render');
    }
    if (path === 'links') {
      console.log('render links');
      renderLinks(watchedState.links);
    }
  });

  return watchedState;
};
