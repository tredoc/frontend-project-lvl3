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

export const renderLinks = (posts) => {
  const parents = document.querySelectorAll('.links');
  parents.forEach((parent) => parent.innerHTML = ''); // eslint-disable-line

  posts.forEach((post) => {
    const a = document.createElement('a');
    a.textContent = post.title;
    a.href = post.href;
    a.title = post.description;
    const { feedId } = post;
    const linksDiv = document.querySelector(`#feed-${feedId} .links`);
    linksDiv.append(a);
  });
};
