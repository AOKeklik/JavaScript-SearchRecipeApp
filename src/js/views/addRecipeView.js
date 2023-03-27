import View from "../View"

class AddRecipeView extends View {
	_containerElement = document.querySelector(".upload")
	_successMessage = "Recipe was successfully uploaded :)"

	_btn = document.querySelector(".nav__btn--add-recipe")
	_btnClose = document.querySelectorAll(".overlay, .btn--close-modal")
	_overlay = document.querySelector(".overlay")
	_window = document.querySelector(".add-recipe-window")

	constructor() {
		super()
		this._addHandlerToggleWindow()
	}
	_addHandlerToggleWindow() {
		this._btn.addEventListener("click", this.toggleWindow.bind(this))
		this._btnClose.forEach(el =>
			el.addEventListener("click", this.toggleWindow.bind(this))
		)
	}
	toggleWindow() {
		this._overlay.classList.toggle("hidden")
		this._window.classList.toggle("hidden")
	}
	addHandlerUpload(handle) {
		this._containerElement.addEventListener("submit", function (e) {
			e.preventDefault()
			handle([...new FormData(this)])
		})
	}
}

export default new AddRecipeView()
