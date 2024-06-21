const domains = ["https://v.redd.it", "https://i.redd.it", "https://x.com"];
const regex = /^[A-Za-z\s]+ (\d+|\[\d+\]) - (\d+|\[\d+\]) [A-Za-z\s]+.*$/;

module.exports = (posts) => {
  return posts.filter((post) => {
    const postUrl = post.data.url;

    if (!regex.test(post.data.title.replace(/\s+/g, " ").trim())) {
      return false;
    }

    console.log("Found goal: ", post.data.title, ":", post.data.url);

    // Check if the post URL does not start with any of the specified domains
    const isExcludedDomain = domains.some((domain) =>
      postUrl.startsWith(domain)
    );
    return !isExcludedDomain;
  });
};
