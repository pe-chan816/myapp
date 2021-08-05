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
    const imageUrl = `${process.env.REACT_APP_API_DOMAIN}/${e.profile_image?.url}`;
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
              <div>
                <Link color="inherit" component={RouterLink} to={userUrl}>
                  {e.name}
                </Link>
                <p>@{e.unique_name}</p>
              </div>
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
