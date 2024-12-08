const axios = require("axios");
const input = `You are receiving a post object retrieved from the reddit API from the r/soccer subreddit. You need to analyze it and respond with a json object shaped like this: 
  { 
   isItGoalUpdateVideo: boolean, // ONLY GOAL VIDEOS in this format "Arsenal 1 - 0 West Ham - Declan Rice" or variations of this format
   isHighlightVideo: boolean, // everything that is not isItGoalUpdateVideo but is a replay, a skill video, a red card, a var review. if it is an interview RETURN FALSE
   isWomensTeam: boolean, // 
   isYouthMatch: boolean, // is youth match, under 19 and such
   atLeastOneTeamInTopFiveLeagues: boolean, // return true only if at least one team belongs to Serie A, Bundesliga, Ligue 1, La Liga, Premier League, Turkish Süper Lig, Portuguese Primeira Liga.
   isInternationalCompetition: boolean // if goalVideo true, analyze the name of the two teams. if they belong to different leagues return true
   homeTeam: string | null,
   awayTeam: string | null,
   league: string | null, // if homeTeam and awayTeam are from the same country, infer the league name from the top leagues in Europe, if they're not from the same country return false 
   goalScorer: string | null, // if isItGoalUpdateVideo true, return the goal scorer
   isRedditVideo: boolean // if the video is posted direcly on reddit return true
   fallbackUrlRedditVideo: string | null, // if isRedditVideo true, return the fallback_url
   externalVideoUrl: string | null, // if external video return url
   originalPostTitle: string,
   } 
   Output only the JSON, without any additional text or explanations.`;
require("dotenv").config();

// const regex = /^[A-Za-z\s\.*]+ (\d+|\[\d+\])\s*-\s*(\d+|\[\d+\]) [A-Za-z\s]+.*\s*$/;

module.exports = async (posts) => {
  try {
    let filteredPosts = posts.map((post) => ({
      title: post.data.title,
      url: post.data.url,
      fallbackUrlRedditVideo: post.data.is_video
        ? post.data.secure_media.reddit_video.fallback_url
        : null,
    }));
    if (!filteredPosts || filteredPosts.length === 0) return filteredPosts;
    // get open ai to filter
    const postsFilteredByAI = await Promise.all(
      filteredPosts.map(async (post) => {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: input,
              },
              {
                role: "user",
                content: JSON.stringify(post),
              },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
            },
          }
        );
        return response.data;
      })
    );
    const finalFiltered = postsFilteredByAI
      .map((post) => JSON.parse(post.choices[0].message.content))
      .filter((post) => !post.isWomensTeam) // exclude womens
      .filter((post) => !post.isYouthMatch) // exclude U19 teams
      .filter((post) => post.isItGoalUpdateVideo || post.isHighlightVideo) // include goal video or highlights
      .filter(
        (post) =>
          post.atLeastOneTeamInTopFiveLeagues || post.isInternationalCompetition
      );

    console.log(finalFiltered);
    return finalFiltered;
  } catch (err) {
    if (err.response) {
      console.error("Error Response:", err.response.data);
    } else {
      console.error("Error Message:", err.message);
    }
    throw err;
  }
};
