import View from './view';
import previewView from './previewView';

// Class representing the bookmark view
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Generating the markup for the bookmarks
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
