import onChange from 'on-change';
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
        errorMessage.textContent = 'valid';
        button.disabled = false;
      } else {
        input.classList.add('input-warning');
        button.disabled = true;
      }
    }

    if (path === 'form.processError') {
      console.log(value);
      if (value.length) {
        errorMessage.textContent = value[0].type;
      } else {
        console.log('ololo');
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
          errorMessage.textContent = 'sending';
          break;
        case 'finished':
          console.log('finished!');
          renderRss(watchedState.feeds, '.rss-links');
          button.disabled = false;
          input.value = '';
          errorMessage.textContent = 'ready';
          break;
        case 'failed':
          console.log('ну, тут очевидно нет связи');
          break;
        default:
          console.log('unknown state');
      }
    }
  });

  return watchedState;
};
