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
  user_id: number,
  hashname: HashtagType[]
};

export type HashtagType = {
  id: number,
  hashname: string,
  create_at: string,
  updated_at: string,
  count?: number
};

export type LatlngType = {
  lat: number,
  lng: number
};


export type BarInfoType = {
  name: string,
  address: string,
  phone_number: string,
  openingHours: string,
  lat: number,
  lng: number
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
