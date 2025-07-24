import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Handle click on pagination buttons
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  // Generate markup for pagination buttons
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 && Other pages
    if (currentPage === 1 && numPages > 1)
      return this._generateMarkupButton('next');

    // Last page
    if (currentPage === numPages && numPages > 1)
      return this._generateMarkupButton('prev');

    // Other page
    if (currentPage < numPages)
      return (
        this._generateMarkupButton('prev') + this._generateMarkupButton('next')
      );

    // Page 1 && NO other pages
    return '';
  }

  // Generate markup for pagination button
  _generateMarkupButton(type) {
    const pageNum = this._data.page + (type === 'next' ? 1 : -1);
    const pageIcon = type === 'next' ? 'right' : 'left';

    const span = /*html*/ `<span>Page ${pageNum}</span>`;
    const svg = /*html*/ `
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${pageIcon}"></use>
      </svg>
    `;

    return /*html*/ `
      <button class="btn--inline pagination__btn--${type}" data-goto="${pageNum}">
        ${type === 'prev' ? svg + span : span + svg}
      </button>
    `;
  }
}

export default new PaginationView();
