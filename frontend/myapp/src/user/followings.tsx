import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { UserContext } from 'App';

type locationType = {
  pathname: string;
  state: userType[];
}

type userType = {
  email: string;
  id: number;
  name: string;
  profile_image: {
    url?: string
  };
}

const UserRelationship = () => {
  const location: locationType = useLocation();
  const data: userType[] = location.state;
  const { user } = useContext(UserContext);

  console.log(location);
  console.log(user);

  const mapUserData = data.map((e: userType, i) => {
    const imageUrl = `http://localhost:3000/${e.profile_image?.url}`;
    const userUrl = `/user/${e.id}`;

    return (
      <div key={i}>
        {e.profile_image?.url && <img src={imageUrl} alt="user" />}
        <Link to={userUrl}>{e.name}</Link>
      </div >
    );
  });

  return (
    <div>
      <h1>followings or followers</h1>
      {user.profile_image?.url && <img src={`http://localhost:3000/${user.profile_image.url}`} alt="user" />}
      <Link to={`/user/${user.id}`}><p>{user.name}</p></Link>
      {mapUserData}
    </div>
  );

}

export default UserRelationship;
