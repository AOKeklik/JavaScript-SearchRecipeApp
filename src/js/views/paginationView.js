import * as icon from "../../img/icons.svg"
import View from "../View"

class PaginationView extends View {
	_containerElement = document.querySelector(".pagination")

	addHandlerClick(handler) {
		this._containerElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--inline")
			if (!btn) return
			const goto = +btn.dataset.goto
			handler(goto)
		})
	}

	_generateMarkup() {
		const currentPage = this._data.page
		const totalPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		)

		if (currentPage === 1 && totalPages > 1)
			return `
            <button data-goto="${
				currentPage + 1
			}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                      <use href="${icon}#icon-arrow-right"></use>
                </svg>
            </button>
        `

		if (currentPage === totalPages && totalPages > 1)
			return `
            <button data-goto="${
				currentPage - 1
			}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                      <use href="${icon}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
        `

		if (currentPage < totalPages)
			return `
            <button data-goto="${
				currentPage - 1
			}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                      <use href="${icon}g#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            <button data-goto="${
				currentPage + 1
			}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                      <use href="${icon}#icon-arrow-right"></use>
                </svg>
            </button>
        `
		return ""
	}
}

export default new PaginationView()
