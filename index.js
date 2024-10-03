const getPosts = require("./handlers/getPosts");
const filterPosts = require("./handlers/filterPosts");
const getAccessToken = require("./reddit/getAccessToken");
const checkDb = require("./handlers/checkDb");
const checkForUpdates = require("./handlers/checkForUpdates");

module.exports.handler = async function () {
  try {
    // get reddit access token
    const accessToken = await getAccessToken();
    // get reddit posts
    const rawPosts = await getPosts(accessToken);
    // check if any new post
    const posts = await checkForUpdates(rawPosts);
    // if no updates return
    if (!posts || posts.length === 0) return console.log("No new updates");
    console.log(posts.map((post) => post.data.title));
    // filter post and exclude bad domains
    const filteredPosts = await filterPosts(posts);
    // if empty return
    if (!filteredPosts || filteredPosts.length === 0)
      return console.log("No relevant posts.");

    // check in db for entries
    const updates = await checkDb(filteredPosts);
    // if no new updates return
    if (!updates || updates.length === 0) return console.log("No new updates.");
    console.log(updates);
  } catch (err) {
    console.log("Something went wrong", err.message);
  }
};

// module.exports.handler();
