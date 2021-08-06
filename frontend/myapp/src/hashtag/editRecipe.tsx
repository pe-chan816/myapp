import axios from "axios";
import { useState, useContext } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { RecipeContext } from "hashtag/hashtagDetail";

import { Button, FormControl, Grid, InputLabel, Link, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


const EditRecipe = () => {
  const hashname = Object.values(useParams());

  const { recipe, setRecipe } = useContext(RecipeContext);
  const [newMaterial, setNewMaterial] = useState<string>("");
  const [newAmount, setNewAmount] = useState<number>();
  const [newUnit, setNewUnit] = useState<string>("");
  const [newPosition, setNewPosition] = useState<number>(0);
  const useStyles = makeStyles({
    base: {
      margin: "0 auto",
      maxWidth: "600px",
      width: "100%"
    },
    button: {
      margin: "0 8px"
    }
  });
  const classes = useStyles();

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

    const url = `${process.env.REACT_APP_API_DOMAIN}/hashtag/${hashname}/edit/recipe`;
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
      setRecipe(res.data.recipes);
    });

    const clearText = () => {
      setNewMaterial("");
      setNewAmount(undefined);
      setNewUnit("");
    };
    clearText();
  };

  const recipeList = recipe.map((e, i) => {
    if (e) {
      const deleteList = () => {
        console.log(e);
        const url = `${process.env.REACT_APP_API_DOMAIN}/hashtag/delete/recipe/${e.id}`;
        const config = { withCredentials: true };
        axios.delete(url, config).then(res => {
          console.log(res);
          setRecipe([]);
          setRecipe(res.data.new_recipe);
        });
      };

      return (
        <div key={i}>
          {e.material} : {e.amount} {e.unit}
          <Link className={classes.button}
            color="inherit"
            component="button"
            data-testId={`CloseIcon${i}`}
            onClick={deleteList}
          >
            <CloseIcon fontSize="small" />
          </Link>
        </div>
      );
    }
  });

  const AddButton = () => {
    const AbleButton = () => {
      return (
        <Button className={classes.button}
          color="primary"
          onClick={addList}
          variant="contained"
        >
          追加
        </Button >
      );
    };

    if (newMaterial !== "" && newUnit === "適量") {
      return (
        <AbleButton />
      );
    } else if (newMaterial !== "" && newAmount !== undefined && newUnit !== "") {
      return (
        <AbleButton />
      );
    } else {
      return (
        <Button className={classes.button} disabled variant="contained">
          追加
        </Button>
      );
    };
  };

  return (
    <Grid alignItems="center"
      className={classes.base}
      container
      direction="column"
      justifyContent="center"
    >
      <Grid item>
        <Link color="inherit" component={RouterLink} to={`/hashtag/${hashname}`}>
          <h2>#{hashname}</h2>
        </Link>
      </Grid>

      <Grid item>
        {recipeList}
      </Grid>

      <Grid item>
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextField label="材料"
            placeholder="ジン, ウォッカ etc..."
            onChange={e => setNewMaterial(e.target.value)}
            type="text"
            value={newMaterial} />

          {newUnit !== "適量" &&
            <TextField label="分量"
              onChange={e => setNewAmount(Number(e.target.value))}
              placeholder="45 etc..."
              type="number"
              value={newAmount} />}

          <FormControl>
            <InputLabel id="recipe-unit">単位</InputLabel>
            <Select labelId="recipe-unit"
              style={{ minWidth: "100px" }}
              value={newUnit}
              onChange={(e) => {
                if (e.target.value === "適量") {
                  setNewAmount(undefined);
                }
                setNewUnit(e.target.value as string);
              }}
            >
              <MenuItem value="">------</MenuItem>
              <MenuItem value="drop"> drop</MenuItem>
              <MenuItem value="dash">dash</MenuItem>
              <MenuItem value="tsp">tsp</MenuItem>
              <MenuItem value="ml">ml</MenuItem>
              <MenuItem value="適量">適量</MenuItem>
            </Select>
          </FormControl>

          <AddButton />

        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditRecipe;
