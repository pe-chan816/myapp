import { useContext, useState } from "react";
import { TagDataContext, RecipeContext, BarInfoContext } from "./hashtagDetail";
import { Link } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const HashtagDetailContent = () => {
  console.log("!!HashtagDetailContext!!");
  const { tagData } = useContext(TagDataContext);
  const { recipe } = useContext(RecipeContext);
  const { barInfo } = useContext(BarInfoContext);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showRecipeEdit, setShowRecipeEdit] = useState<boolean>(false);
  const [showBarInfoEdit, setShowBarInfoEdit] = useState<boolean>(false);

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
    if (barInfo) {
      const containerStyle = {
        width: '70%',
        height: '60vh',
        margin: '0 auto'
      };

      const center = {
        lat: barInfo.lat,
        lng: barInfo.lng
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
          <div>
            <p>{barInfo.name}</p>
            <p>{barInfo.address}</p>
            <p>{barInfo.phone_number}</p>
          </div>
        </div>

      );
    };
  };
  const barContent = barLocation();

  const linkWithRadioButtonJSX = () => {
    return (
      <div>
        <p>このタグがカクテルについてのものならレシピを、</p>
        <p>BARについてのものならGooglemapを利用してお店の情報を登録してみましょう！</p>
        <div>
          <input
            type="radio" name="tag" id="cocktail_radio"
            onChange={() => { setShowRecipeEdit(true); setShowBarInfoEdit(false); }} />
          <label htmlFor="cocktail_radio">カクテル</label>
          <input type="radio" name="tag" id="bar_info_radio"
            onChange={() => { setShowBarInfoEdit(true); setShowRecipeEdit(false); }} />
          <label htmlFor="bar_info_radio">BAR</label>
        </div>
        {showRecipeEdit &&
          <Link to={`/hashtag/${tagData.hashname}/edit/recipe`}>レシピ編集</Link>}
        {showBarInfoEdit &&
          <Link to={`/hashtag/${tagData?.hashname}/edit/map`}>マップ編集</Link>}
      </div>
    );
  };
  const linkWithRadioButton = linkWithRadioButtonJSX();

  console.log(barInfo);

  return (
    <div>
      <h1>#{tagData?.hashname}</h1>
      {recipe.toString() !== [].toString() &&
        <div>{recipeList}</div>}
      {JSON.stringify(barInfo) !== JSON.stringify({}) &&
        <div>{barContent}</div>}

      <button onClick={() => setShowEdit(!showEdit)}>タグ編集</button>
      {showEdit &&
        <div>{linkWithRadioButton}</div>}
    </div>
  );
};

export default HashtagDetailContent;
