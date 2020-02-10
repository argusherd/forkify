import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { element, renderLoader, clearLoader } from './views/base';

/**
 * global state of the app
 */
const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    
    if (query) {
        state.search = new Search(query);
        
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(element.searchResults);
        
        try {
            await state.search.getRecipes();
        
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (error) {
            console.log(error);
            alert('Something went wrong.');
        }
    }
}

element.searchForum.addEventListener('submit', e => {
   e.preventDefault();
   controlSearch();
});

element.searchResPages.addEventListener('click', e => {
   const btn = e.target.closest('.btn-inline');
   if (btn) {
       const goto = parseInt(btn.dataset.goto);
       searchView.clearResults();
       searchView.renderResults(state.search.results, goto);
   }
});

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // prepare UI
        recipeView.clearRecipe();
        renderLoader(element.recipe);
        
        // highlight selected item
        if (state.search) searchView.highlightSelected(id);
        
        // create new recipr object
        state.recipe = new Recipe(id);
        
        try {
            // get recipe
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // calcu time and servings
            state.recipe.calcuTime();
            state.recipe.calcuServings();
            
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            console.log(error);
            alert('Something went wrong.');
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

const controlList = () => {
    if (!state.list) state.list = new List();
    
    state.recipe.ingredients.forEach(ingred => {
        const {count, unit, ingredient} = ingred;
        const item = state.list.addItem(count, unit, ingredient);
        listView.renderItem(item);
    });
}

element.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
});

const updateCount = e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
}

['click', 'keyup'].forEach(event => element.shoppingList.addEventListener(event, updateCount));

const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    if (!state.likes.isLiked(currentID)) {
        const like = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
            );
            
        likesView.toggleLikeBtn(true);
        likesView.renderLike(like);
    } else {
        state.likes.deleteLike(currentID);
        
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.getLikes().forEach(like => likesView.renderLike(like));
})

element.recipe.addEventListener('click', e => {
   if (e.target.matches('.btn-decrease, .btn-decrease *')) {
       if (state.recipe.servings > 1) {
           state.recipe.updateServings('dec');
           recipeView.updateServingsIngredients(state.recipe);
       }
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
       state.recipe.updateServings('inc');
       recipeView.updateServingsIngredients(state.recipe);
   } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
       controlList();
   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
       controlLikes();
   }
});
