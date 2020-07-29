const parser = (data) => {
  const parsed = new window.DOMParser().parseFromString(data, 'text/xml');

  if (parsed.firstChild.tagName !== 'rss') {
    throw new Error('wrong data type');
  }

  const channelName = parsed.querySelector('channel>title').textContent;
  const channelDescription = parsed.querySelector('channel>description').textContent;

  const items = [...parsed.querySelectorAll('item')].map((item) => {
    return {
      text: item.querySelector('title').textContent,
      href: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    };
  });

  return {
    feedTitle: channelName,
    feedDescription: channelDescription,
    links: items,
  };
};

export default parser;
