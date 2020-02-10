import { element, elementStr } from './base';

export const getInput = () => element.searchInput.value;

export const clearInput = () => {
    element.searchInput.value = '';
}

export const clearResults = () => {
    element.searchResList.innerHTML = "";
    element.searchResPages.innerHTML = "";
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll(`.${elementStr.resultsLink}`));
    resultsArr.forEach(el => el.classList.remove(`${elementStr.resultsLink}--active`));
    
    document.querySelector(`.${elementStr.resultsLink}[href="#${id}"]`).classList.add(`${elementStr.resultsLink}--active`);
}

/**
 * potato pasta is potato with pasta
 */
export const limitReceipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = [];
        
        title.split(' ').reduce((accmu, curr) => {
            if (accmu + curr.length <= limit) {
                newTitle.push(curr);
            }
            return accmu + curr.length;
        }, 0);
        
        return newTitle.join(' ') + ' ...';
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitReceipeTitle((recipe.title))}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    element.searchResList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    
    let button = '';
    switch (true) {
        case page === 1 && pages > 1:
            button = createButton(page, 'next');
            break;
        case page < pages:
            button = `
                ${createButton(page, 'prev')}
                ${createButton(page, 'next')}
            `;
            break;
        case page === pages && pages > 1:
            button = createButton(page, 'prev');
            break;
    }
    element.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
}