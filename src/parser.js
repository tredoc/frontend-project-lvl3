const parse = (data) => {
  const parsedData = new DOMParser().parseFromString(data, 'text/xml');
  const parserError = parsedData.querySelector('parsererror');
  if (parserError) {
    throw new Error('parserError');
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
