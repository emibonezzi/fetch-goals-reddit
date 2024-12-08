const getPosts = require("./handlers/getPosts");
const filterPosts = require("./handlers/filterPosts");
const getAccessToken = require("./reddit/getAccessToken");
const checkForUpdates = require("./handlers/checkForUpdates");
const processVideo = require("./handlers/processVideo");
const saveNewVideos = require("./handlers/saveNewVideos");

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
    // filter post with AI
    const filteredPosts = await filterPosts(posts);
    // if empty return
    if (!filteredPosts || filteredPosts.length === 0)
      return console.log("No relevant posts.");

    // process all new videos
    const updates = await processVideo(filteredPosts);
    // if no new updates return
    if (!updates || updates.length === 0) return console.log("No new updates.");
    console.log(updates);

    // add new videos to db
    await saveNewVideos(updates);
    console.log("New goals saved!");
  } catch (err) {
    console.log("Something went wrong", err.message);
  }
};

module.exports.handler();
