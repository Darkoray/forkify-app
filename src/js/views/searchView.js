class SearchView {
  _parentElement = document.querySelector('.search');

  // Get the search query from the input field and clear it
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // Clear the search input field
  _clearInput() {
    return (this._parentElement.querySelector('.search__field').value = '');
  }

  // Listen for form submit and call the provided handler
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
