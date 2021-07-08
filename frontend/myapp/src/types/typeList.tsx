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

export type TimelineType = {
  content: string,
  created_at: string,
  id: number,
  name: string,
  profile_image?: { url: string },
  tweet_image?: { url: string },
  updated_at: string,
  user_id: number
};

export type LatlngType = {
  lat: number,
  lng: number
};

export type HashtagType = {
  id: number,
  hashname: string,
  create_at: string,
  updated_at: string
};


export type InformationType = {
  name: string,
  address: string,
  phoneNumber: string,
  openingHours: string
};

export type RecipeType = {
  id: number,
  material: string,
  amount?: string,
  unit: string,
  created_at: string,
  updated_at: string,
  hashtag_id: number,
  position: number
};
