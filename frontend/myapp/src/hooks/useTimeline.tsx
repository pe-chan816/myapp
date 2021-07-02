import { UserType, TweetType } from 'types/typeList';
import { Link } from 'react-router-dom';

const useTimeline = (user: Partial<UserType>[], content: TweetType[]) => {

  const timelineContent = content.map((e: TweetType, i: number) => {
    const whoTweet = user.filter(user => {
      return user.id === e.user_id;
    });
    const tweetUser: Partial<UserType> = whoTweet[0];

    return (
      <div key={i}>
        <Link to={`/tweets/${e.id}/detail`}>
          {tweetUser.profile_image?.url && <img src={`http://localhost:3000/${tweetUser.profile_image.url}`} alt="user" />}
          <p>{tweetUser.name}</p>
          <p>{e.content}</p>
          {e.tweet_image?.url && <img src={`http://localhost:3000/${e.tweet_image.url}`} alt="tweet" />}
          <p>{e.created_at}</p>
        </Link>
      </div>
    );
  });

  console.log(timelineContent);

  return (
    <div>
      {timelineContent}
    </div>
  );
};

export default useTimeline;
