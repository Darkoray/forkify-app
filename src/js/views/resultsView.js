import View from './view';
import previewView from './previewView';

// Class representing the results view
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again`;
  _message = '';

  // Generating the markup for the result
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
