import View from "../View"
import previewView from "./previewView"

class BookmarksView extends View {
	_containerElement = document.querySelector(".bookmarks__list")
	_errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)"

	addHandlerRender(handle) {
		window.addEventListener("load", handle)
	}

	_generateMarkup() {
		return this._data.map(book => previewView.render(book, false)).join("")
	}
}

export default new BookmarksView()
