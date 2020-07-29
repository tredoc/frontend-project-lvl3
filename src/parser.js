const parser = (data) => {
  const parsed = new window.DOMParser().parseFromString(data, 'text/xml');

  if (parsed.firstChild.tagName !== 'rss') {
    throw new Error('wrong data type');
  }

  const channelName = parsed.querySelector('channel>title').textContent;
  const channelDescription = parsed.querySelector('channel>description').textContent;

  const items = [...parsed.querySelectorAll('item')].map((item) => {
    const obj = {};
    obj.text = item.querySelector('title').textContent;
    obj.href = item.querySelector('link').textContent;
    obj.description = item.querySelector('description').textContent;

    return obj;
  });

  return {
    feedTitle: channelName,
    feedDescription: channelDescription,
    links: items,
  };
};

export default parser;
