import onChange from 'on-change';
import i18next from 'i18next';
import { renderFeed, renderLinks } from './renders';

export default (state, ...elements) => {
  const [input, button, userMessage] = elements;
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
      if (typeof value === 'number') {
        userMessage.textContent = `${value}: ${i18next.t('statuses.failed')}`;
      } else {
        userMessage.textContent = i18next.t(`errors.${[value[0].type]}`);
      }
      userMessage.style.color = 'red';
    }

    if (path === 'form.processState') {
      switch (watchedState.form.processState) {
        case 'filling':
          button.disabled = false;
          break;
        case 'sending':
          button.disabled = true;
          userMessage.textContent = i18next.t('statuses.sending');
          userMessage.style.color = '#007bff';
          break;
        case 'finished':
          button.disabled = false;
          input.value = '';
          userMessage.textContent = i18next.t('statuses.ready');
          userMessage.style.color = '#25a925';
          break;
        case 'failed':
          userMessage.textContent = i18next.t('statuses.failed');
          userMessage.style.color = 'red';
          break;
        default:
      }
    }

    if (path === 'feeds') {
      renderFeed(watchedState.feeds, '.rss-links');
    }
    if (path === 'posts') {
      renderLinks(watchedState.posts);
    }
  });

  return watchedState;
};
