const getPosts = require("./handlers/getPosts");
const filterPosts = require("./handlers/filterPosts");
const getAccessToken = require("./reddit/getAccessToken");
const checkDb = require("./handlers/checkDb");

module.exports.handler = async function () {
  // get reddit access token
  const accessToken = await getAccessToken();
  // get posts
  const posts = await getPosts(accessToken);
  // filter post and exclude bad domains
  const filteredPosts = filterPosts(posts);
  // if empty return
  if (!filteredPosts && filteredPosts.length === 0)
    return console.log("No relevant posts.");
  // collect titles and sources
  const titles = filteredPosts.map((post) => ({
    title: post.data.title,
    url: post.data.url,
  }));

  // check in db for entries
  const updates = await checkDb(titles);
  // if no new updates return
  if (updates.length === 0) return console.log("No new updates.");

  console.log(updates);
};
