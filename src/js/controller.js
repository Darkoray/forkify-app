import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// Enable hot module replacement if available
if (module.hot) {
  module.hot.accept();
}

// Control the display of a recipe
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 1. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2. Load the recipe by ID
    await model.loadRecipe(id);

    // 3. Render the loaded recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Control the search results display
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get the search query from input
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load the search results
    await model.loadSearchResult(query);

    // 3. Render the search results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

// Control pagination of search results
const controlPagination = function (goToPage) {
  // Render new search results for the specified page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

// Control the update of servings in a recipe
const controlServings = function (newServings) {
  // Update the servings in the state
  model.updateServings(newServings);

  // Update the recipe view with new servings
  recipeView.update(model.state.recipe);
};

// Initialize event handlers
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
