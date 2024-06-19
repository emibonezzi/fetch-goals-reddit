const domains = ["https://v.redd.it", "https://i.redd.it", "https://x.com"];
const flairs = ["Media"];
const regex = /^[A-Za-z\s]+ \d+ - \[\d+\] [A-Za-z\s]+.*$/;

module.exports = (posts) => {
  return posts.filter((post) => {
    const postFlair = post.data.link_flair_text;
    const postUrl = post.data.url;

    if (!flairs.includes(postFlair)) {
      return false;
    }

    if (!regex.test(post.data.title)) {
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
