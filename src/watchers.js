import onChange from 'on-change';
import i18next from 'i18next';
import renderRss from './renders';

const form = document.querySelector('form');
const input = form.querySelector('input');
const button = form.querySelector('button');
const errorMessage = document.querySelector('.error-message');

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.valid') {
      if (value === true) {
        input.classList.remove('input-warning');
        errorMessage.textContent = i18next.t('errors.valid');
        errorMessage.style.color = 'green';
        button.disabled = false;
      } else {
        input.classList.add('input-warning');
        button.disabled = true;
      }
    }

    if (path === 'form.processError') {
      if (value.length) {
        errorMessage.textContent = i18next.t(`errors.${[value[0].type]}`);
        errorMessage.style.color = 'red';
      }
    }
    // if (path === 'posts') {
    // }

    if (path === 'form.processState') {
      switch (watchedState.form.processState) {
        case 'filling':
          console.log('form filling!');
          button.disabled = false;
          break;
        case 'sending':
          console.log('form is sending!');
          button.disabled = true;
          errorMessage.textContent = i18next.t('statuses.sending');
          errorMessage.style.color = '#007bff';
          break;
        case 'finished':
          console.log('finished!');
          renderRss(watchedState.feeds, '.rss-links');
          button.disabled = false;
          input.value = '';
          errorMessage.textContent = i18next.t('statuses.ready');
          errorMessage.style.color = '#25a925';
          break;
        case 'failed':
          console.log('failed');
          errorMessage.textContent = i18next.t('statuses.failed');
          errorMessage.style.color = 'red';
          break;
        default:
          console.log('unknown state');
      }
    }
  });

  return watchedState;
};
