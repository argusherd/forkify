import axios from 'axios';
import { proxy, key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe() {
        const getUrl = 'https://www.food2fork.com/api/get';
        
        try {
            const res = await axios(`${proxy}${getUrl}?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    }
    
    calcuTime() {
        // assuming we need 15 min for each 3 ingredients
        const numIngreds = this.ingredients.length;
        const periods = Math.ceil(numIngreds / 3);
        this.time = periods * 15;
    }
    
    calcuServings() {
        this.servings = 4;
    }
    
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        
        const newIngreds = this.ingredients.map(el => {
            // uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            // remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            
            // parse ingredient in to count, unit and ingredient itself
            const arrIngred = ingredient.split(' ');
            const unitIndex = arrIngred.findIndex(el2 => units.includes(el2));
            
            let objIngred;
            if (unitIndex > -1) {
                // there is a unit
                const arrCount = arrIngred.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIngred[0].replace('-', '+'));
                } else {
                    count = eval(arrIngred.slice(0, unitIndex).join('+'));
                }
                
                objIngred = {
                    count: Math.round(count * 10) / 10,
                    unit: arrIngred[unitIndex],
                    ingredient: arrIngred.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIngred[0], 10)) {
                // there is NO unit, but first el is number
                objIngred = {
                    count: 1,
                    unit: '',
                    ingredient: arrIngred.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // there is NO unit and NO number in first position
                objIngred = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            
            return objIngred;
        });
        
        this.ingredients = newIngreds;
    }
    
    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        this.ingredients.forEach(el => {
            el.count *= (newServings / this.servings);
        });
        
        this.servings = newServings;
    }
}