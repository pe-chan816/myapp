export type UserType = {
  admin: boolean,
  email: string,
  gueat: boolean,
  id: number,
  name: string,
  profile_image?: { url: string }
};

export type TweetType = {
  content: string,
  created_at: string,
  id: number,
  tweet_image?: { url: string },
  user_id: number,
};
