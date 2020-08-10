const parse = (data) => { // Не сообразил как нормально вернуть ошибку парсинга
  let parsedData;
  try {
    parsedData = new window.DOMParser().parseFromString(data, 'text/xml');
  } catch (error) {
    throw new Error(`${error} Cant parse data`);
  }

  if (parsedData.firstChild.tagName !== 'rss') {
    throw new Error('wrong data type');
  }

  const channelName = parsedData.querySelector('channel>title').textContent;
  const channelDescription = parsedData.querySelector('channel>description').textContent;
  const channelPosts = parsedData.querySelectorAll('item');
  const posts = [...channelPosts].map((post) => {
    const obj = {};
    obj.title = post.querySelector('title').textContent;
    obj.href = post.querySelector('link').textContent;
    obj.description = post.querySelector('description').textContent;

    return obj;
  });

  return {
    feedData: {
      feedTitle: channelName,
      feedDescription: channelDescription,
    },
    feedPosts: posts,
  };
};

export default parse;
