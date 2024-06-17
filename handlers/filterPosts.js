const domains = ["https://v.redd.it", "https://i.redd.it"];

module.exports = (posts) => {
  return posts.filter((post) => {
    const postUrl = post.data.url;
    // Check if the post URL does not start with any of the specified domains
    const isExcludedDomain = domains.some((domain) =>
      postUrl.startsWith(domain)
    );
    return !isExcludedDomain;
  });
};
