import * as icon from "../img/icons.svg"

export default class View {
	_data

	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError()

		this._data = data
		const markup = this._generateMarkup()

		if (!render) return markup

		this._cleaner()
		this._containerElement.insertAdjacentHTML("afterbegin", markup)
	}
	update(data) {
		this._data = data
		const markup = this._generateMarkup()
		const newDom = Array.from(
			document
				.createRange()
				.createContextualFragment(markup)
				.querySelectorAll("*")
		)
		const oldDom = Array.from(this._containerElement.querySelectorAll("*"))

		newDom.forEach((el, i, _) => {
			// console.log(el, el.isEqualNode(oldDom[i]))

			if (
				!el.isEqualNode(oldDom[i]) &&
				el.firstChild?.nodeValue.trim() !== ""
			)
				oldDom[i].textContent = el.textContent

			if (!el.isEqualNode(oldDom[i]))
				Array.from(newDom[i].attributes).forEach(el => {
					oldDom[i].setAttribute(el.name, el.value)
				})
		})
	}
	renderSpiner() {
		const markup = `
            <div class="spinner">
                <svg>
                <use href="${icon}icons.svg#icon-loader"></use>
                </svg>
            </div>
        `
		this._cleaner()
		this._containerElement.insertAdjacentHTML("afterbegin", markup)
	}
	_cleaner() {
		this._containerElement.innerHTML = ""
	}
	renderError(message = this._errorMessage) {
		const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icon}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `
		this._cleaner()
		this._containerElement.insertAdjacentHTML("afterbegin", markup)
	}
	renderSuccess(message = this._successMessage) {
		const markup = `
			<div class="message">
				<div>
				<svg>
					<use href="${icon}#icon-smile"></use>
				</svg>
				</div>
				<p>${message}</p>
			</div>
		`
		this._cleaner()
		this._containerElement.insertAdjacentHTML("afterbegin", markup)
	}
}
