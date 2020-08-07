const parser = (data) => {
  const parsed = new window.DOMParser().parseFromString(data, 'text/xml');

  if (parsed.firstChild.tagName !== 'rss') {
    throw new Error('wrong data type');
  }

  const channelName = parsed.querySelector('channel>title').textContent;
  const channelDescription = parsed.querySelector('channel>description').textContent;

  const links = [...parsed.querySelectorAll('item')].map((item) => {
    const obj = {};
    obj.title = item.querySelector('title').textContent;
    obj.href = item.querySelector('link').textContent;
    obj.description = item.querySelector('description').textContent;

    return obj;
  });

  return {
    feedData: {
      feedTitle: channelName,
      feedDescription: channelDescription,
    },
    feedLinks: links,
  };
};

export default parser;
