import { useContext } from "react";
import { TagDataContext, RecipeContext, LatlngContext } from "./hashtagDetail";
import { Link } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const HashtagDetailContent = () => {
  console.log("!!HashtagDetailContext!!");
  const { tagData } = useContext(TagDataContext);
  const { recipe } = useContext(RecipeContext);
  const { latlng } = useContext(LatlngContext);

  const recipeList = recipe.map((e, i) => {
    if (e) {
      return (
        <div key={i}>
          <p>{e.material} : {e.amount} {e.unit}</p>
        </div>
      );
    };
  });

  const barLocation = () => {
    if (latlng) {
      const containerStyle = {
        width: '70%',
        height: '60vh',
        margin: '0 auto'
      };

      const center = {
        lat: latlng.lat,
        lng: latlng.lng
      };

      return (
        <div>
          <LoadScript googleMapsApiKey="AIzaSyC0xBkQV6o50tS0t-svTaLzzLigR66fow8">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
          <Link to={`/hashtag/${tagData?.hashname}/edit/map`}>マップ編集</Link>
        </div>
      );
    };
  };
  const barContent = barLocation();

  return (
    <div>
      <h1>#{tagData?.hashname}</h1>
      {recipe.toString() !== [].toString() &&
        <div>{recipeList}</div>}
      {recipe.toString() !== [].toString() &&
        <Link to={`/hashtag/${tagData.hashname}/edit/recipe`}>レシピ編集</Link>}
      {JSON.stringify(latlng) !== JSON.stringify({}) &&
        <div>{barContent}</div>}
    </div>
  );
};

export default HashtagDetailContent;
