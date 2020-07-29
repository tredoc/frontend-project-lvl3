const renderRss = (feeds, parentSelector) => {
  const parent = document.querySelector(parentSelector);
  parent.innerHTML = '';

  feeds.map((feed) => {
    const h2 = document.createElement('h2');
    h2.textContent = feed.feedTitle;
    const h5 = document.createElement('h5');
    h5.textContent = feed.feedDescription;

    feed.links.map((item) => {
      const div = document.createElement('div');
      const a = document.createElement('a');
      a.textContent = item.text;
      a.href = item.href;
      a.title = item.description;

      div.append(a);
      parent.prepend(div);

      return null; // в угоду линтеру
    });
    parent.prepend(h5);
    parent.prepend(h2);
    return null; // в угоду линтеру
  });
};

export default renderRss;
