import View from "../View"

class SearchView extends View {
	_form = document.querySelector(".search")

	addHandlerSearch(callback) {
		this._form.addEventListener("submit", e => {
			e.preventDefault()
			callback()
		})
	}

	_cleaner(el) {
		this._form.querySelector(".search__field").value = ""
	}

	setQuery() {
		const query = this._form.querySelector(".search__field").value
		this._cleaner()
		return query
	}
}

export default new SearchView()
