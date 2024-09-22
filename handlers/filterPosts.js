const relevantTeams = require("./utils/relevantTeams");

const domains = [
  "https://pbs.twimg.com",
  "https://goalsarea.com",
  "https://i.redd.it",
  "https://x.com",
  "https://www.reddit.com",
  "https://www.goalstube.online",
  "https://www.youtube.com",
];
const regex =
  /^[A-Za-z\s\.*]+ (\d+|\[\d+\])\s*-\s*(\d+|\[\d+\]) [A-Za-z\s]+.*\s*$/;

module.exports = (posts) => {
  return posts.filter((post) => {
    const postUrl = post.data.url;
    const postTitle = post.data.title.replace(/\s+/g, " ").trim();

    // Check if the title matches the regex
    if (!regex.test(postTitle)) {
      return false;
    }

    // Check if the post URL does not start with any of the specified domains
    const isExcludedDomain = domains.some((domain) =>
      postUrl.startsWith(domain)
    );

    if (isExcludedDomain) {
      return false;
    }

    // Check if the post title includes any of the relevant teams
    const hasRelevantTeam = relevantTeams.some((team) =>
      postTitle.includes(team)
    );

    // Return true if a relevant team is found
    if (!hasRelevantTeam) {
      return false;
    }

    console.log("Found goal: ", post.data.title, ":", post.data.url);
    return true;
  });
};
