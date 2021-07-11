import { TimelineType } from 'types/typeList';
import { Link } from 'react-router-dom';

const useTimeline = (data: Partial<TimelineType[]>) => {
  console.log("!!useTimeline!!");
  const content = data.map((e, i) => {
    if (e) {
      return (
        <div key={i}>
          <Link to={`/tweets/${e.id}/detail`}>
            {e.profile_image?.url && <img src={`http://localhost:3000/${e.profile_image.url}`} alt="user" />}
            <p>{e.name}</p>
            <p>{e.content}</p>
            {e.tweet_image?.url && <img src={`http://localhost:3000/${e.tweet_image.url}`} alt="tweet" />}
            <p>{e.created_at}</p>
          </Link>
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
