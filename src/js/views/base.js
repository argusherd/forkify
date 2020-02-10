export const element = {
    searchForum: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likeMemu: document.querySelector('.likes'),
    likeList: document.querySelector('.likes__list')
}

export const elementStr = {
    loader: 'loader',
    resultsLink: 'results__link',
    likesLink: 'likes__link'
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStr.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStr.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
}
