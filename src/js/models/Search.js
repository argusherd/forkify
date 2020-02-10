import axios from 'axios';
import { proxy, key } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getRecipes(query) {
        const searchUrl = "https://www.food2fork.com/api/search";
        
        try {
            const res = await axios(`${proxy}${searchUrl}?key=${key}&q=${this.query}`);
            this.results = res.data.recipes;
        } catch(error) {
            console.log(error);
        }
    }
}
