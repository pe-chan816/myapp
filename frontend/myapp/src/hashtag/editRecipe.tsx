import axios from "axios";
import { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { RecipeContext } from "hashtag/hashtagDetail";

import { RecipeType } from "types/typeList";
import { createNoSubstitutionTemplateLiteral } from "typescript";

const EditRecipe = () => {
  const hashname = Object.values(useParams());

  const { recipe, setRecipe } = useContext(RecipeContext);
  const [newMaterial, setNewMaterial] = useState<string>("");
  const [newAmount, setNewAmount] = useState<number>();
  const [newUnit, setNewUnit] = useState<string>("");
  const [newPosition, setNewPosition] = useState<number>(0);

  const addList = () => {
    // レシピのpositionの最大値を取得
    const calculateMax = (a: number, b: number) => {
      return Math.max(a, b);
    };

    const array: number[] = [0];

    recipe.map(e => {
      if (e) {
        array.push(e.position)
      }
    });

    if (array) {
      const positionMax = array.reduce(calculateMax);
      setNewPosition(positionMax);
    };
    /////////////////////////////
    setNewPosition(newPosition + 1);

    const url = `http://localhost:3000/hashtag/${hashname}/edit/recipe`;
    const data = {
      recipe: {
        material: newMaterial,
        amount: newAmount,
        unit: newUnit,
        position: newPosition
      }
    };
    const config = { withCredentials: true };
    axios.post(url, data, config).then(res => {
      console.log(res);
      setRecipe([]);
      res.data.recipes.forEach((e: RecipeType) => setRecipe((recipe: RecipeType[]) => [...recipe, e]));
    });

    const clearText = () => {
      setNewMaterial("");
      setNewAmount(Number(undefined));/////要検証//////
      setNewUnit("");
    };
    clearText();
  };

  const recipeList = recipe.map((e, i) => {
    if (e) {
      const deleteList = () => {
        console.log(e);
        const url = `http://localhost:3000/hashtag/delete/recipe/${e.id}`;
        const config = { withCredentials: true };
        axios.delete(url, config).then(res => {
          console.log(res);
          setRecipe([]);
          res.data.new_recipe.forEach((e: RecipeType) => setRecipe((recipe: RecipeType[]) => [...recipe, e]));
        });
      };

      return (
        <div key={i}>{e.material} : {e.amount} {e.unit} <button onClick={deleteList}>x</button></div>
      );
    }
  });

  return (
    <div>
      <Link to={`/hashtag/${hashname}`}><h1>#{hashname}</h1></Link>
      <div>
        {recipeList}
      </div>
      <div>
        <p>材料</p>
        <input
          type="text"
          name="material"
          value={newMaterial}
          placeholder="材料"
          onChange={e => setNewMaterial(e.target.value)} />
        {newUnit !== "適量" &&
          <input
            type="number"
            name="amount"
            value={newAmount}
            placeholder="分量"
            onChange={e => setNewAmount(Number(e.target.value))} />
        }
        <select name="unit" value={newUnit} onChange={e => setNewUnit(e.target.value)}>
          <option value="">------</option>
          <option value="drop">drop</option>
          <option value="dash">dash</option>
          <option value="tsp">tsp</option>
          <option value="ml">ml</option>
          <option value="適量">適量</option>
        </select>
        <button onClick={addList}>追加</button>
      </div>
    </div>
  );
};

export default EditRecipe;
