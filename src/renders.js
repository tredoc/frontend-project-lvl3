export const renderFeed = (feeds, parentSelector) => {
  const parent = document.querySelector(parentSelector);
  parent.innerHTML = '';

  feeds.forEach((feed) => {
    const h2 = document.createElement('h2');
    h2.textContent = feed.feedTitle;
    const h5 = document.createElement('h5');
    h5.textContent = feed.feedDescription;

    const div = document.createElement('div');
    div.id = `feed-${feed.id}`;
    div.classList.add('d-flex', 'flex-column', 'align-items-center');

    div.prepend(h5);
    div.prepend(h2);
    const linksDiv = document.createElement('div');
    linksDiv.classList.add('links', 'd-flex', 'flex-column', 'align-items-center');
    div.append(linksDiv);

    parent.prepend(div);
  });
};

export const renderLinks = (links) => {
  const parents = document.querySelectorAll('.links');
  parents.forEach((parent) => parent.innerHTML = ''); // eslint-disable-line

  links.forEach((link) => {
    const a = document.createElement('a');
    a.textContent = link.title;
    a.href = link.href;
    a.title = link.description;
    const { feedId } = link;
    const parentDiv = document.querySelector(`#feed-${feedId}`);
    const parent = parentDiv.querySelector('.links');
    parent.append(a);
  });
};
