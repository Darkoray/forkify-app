import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkViews from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
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

    // 2. Updating bookmarks view
    bookmarkViews.update(model.state.bookmarks);

    // 3. Load the recipe by ID
    await model.loadRecipe(id);

    // 4. Render the loaded recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
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

// Add or Delete the recipe to the bookmarks state
const controlAddBookmark = function () {
  // 1. Add or delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmark
  bookmarkViews.render(model.state.bookmarks);
};

// Control the rendering of bookmarks
const controlBookmarks = function () {
  bookmarkViews.render(model.state.bookmarks);
};

// Control the addition of a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkViews.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// Initialize event handlers
const init = function () {
  bookmarkViews.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
