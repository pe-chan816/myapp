import { HashtagType, TimelineType } from 'types/typeList';
import { Link } from 'react-router-dom';

const useTimeline = (data: Partial<TimelineType[]>) => {
  console.log("!!useTimeline!!");

  const content = data.map((e, i) => {
    if (e) {
      const hashtags = e.hashname?.map((tag: HashtagType, n: number) => {
        return (
          <div key={n}>
            <p><Link to={`/hashtag/${tag.hashname}`}>#{tag.hashname}</Link></p>
          </div>
        );
      });

      return (
        <div key={i}>
          {e.profile_image?.url && <img src={`http://localhost:3000/${e.profile_image.url}`} alt="user" />}
          <p>{e.name}</p>
          <p>{e.content}</p>
          {e.hashname &&
            <div>{hashtags}</div>}
          {e.tweet_image?.url && <img src={`http://localhost:3000/${e.tweet_image.url}`} alt="tweet" />}
          <p>{e.created_at}</p>
          <Link to={`/tweets/${e.id}/detail`}><button>詳細</button></Link>
        </div>
      );
    }
  });

  return (
    <div>
      {content}
    </div>
  );
};

export default useTimeline;
