import { useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Avatar, Card, CardContent, CardHeader, Link } from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';

import { UserType } from 'types/typeList';

import { UserContext } from 'App';


type locationType = {
  pathname: string,
  state: UserType[]
}

const UserRelationship = () => {
  const location: locationType = useLocation();
  const data: UserType[] = location.state;
  const { user } = useContext(UserContext);

  console.log(location);
  console.log(user);

  const mapUserData = data.map((e: UserType, i) => {
    const imageUrl = `http://localhost:3000/${e.profile_image?.url}`;
    const userUrl = `/user/${e.id}`;

    return (
      <div key={i}>
        <Card>
          <CardHeader
            avatar={
              <Avatar alt="user-image" src={imageUrl}>
                <PersonIcon color="inherit" fontSize="large" />
              </Avatar>
            }
            title={
              <Link color="inherit" component={RouterLink} to={userUrl}>
                {e.name}
              </Link>
            }
          />
          <CardContent>
            {e.self_introduction}
          </CardContent>
        </Card>
      </div >
    );
  });

  return (
    <div>
      <h1>followings or followers</h1>
      <div>
        {mapUserData}
      </div>
    </div>
  );

}

export default UserRelationship;
