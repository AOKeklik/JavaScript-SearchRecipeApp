import * as model from "./model.js"
import recipeView from "./views/recipeView"
import resultsView from "./views/resultsView"
import searchView from "./views/searchView"
import paginationView from "./views/paginationView.js"
import bookmarksView from "./views/bookmarksView.js"
import addRecipeView from "./views/addRecipeView.js"
import { waitForaSeconds } from "./helper.js"

import "core-js/stable"
import "regenerator-runtime/runtime"
import { async } from "regenerator-runtime"

function init() {
	recipeView.addHandlerRender(controlRecipes)
	recipeView.addHandlerUpdateServings(controlServings)
	recipeView.addHandlerAddBookmark(controlAddBookmark)
	bookmarksView.addHandlerRender(controlBookmarks)
	searchView.addHandlerSearch(controlSearchResults)
	paginationView.addHandlerClick(controlPagination)
	addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()

async function controlRecipes() {
	try {
		const id = window.location.hash.slice(1)
		if (!id) return

		recipeView.renderSpiner()
		resultsView.update(model.getSearchResultsPage())
		await model.loadRecipe(id)
		recipeView.render(model.state.recipe)
		bookmarksView.update(model.state.bookmarks)
	} catch (err) {
		console.log(err)
		recipeView.renderError()
	}
}
async function controlSearchResults() {
	try {
		const query = searchView.setQuery()
		if (!query)
			return resultsView.renderError("Pleace enter any key words!")

		resultsView.renderSpiner()

		await model.loadSearchResults(query)

		resultsView.render(model.getSearchResultsPage())
		paginationView.render(model.state.search)
	} catch (err) {
		console.log(err)
	}
}
function controlPagination(page) {
	resultsView.render(model.getSearchResultsPage(page))
	paginationView.render(model.state.search)
}
function controlServings(num) {
	model.updateServings(num)
	recipeView.update(model.state.recipe)
}
function controlAddBookmark() {
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
	else model.deleteBookmark(model.state.recipe.id)
	recipeView.update(model.state.recipe)
	bookmarksView.render(model.state.bookmarks)
}
function controlBookmarks() {
	bookmarksView.render(model.state.bookmarks)
}
async function controlAddRecipe(data) {
	try {
		addRecipeView.renderSpiner()
		await model.uploadRecipe(data)
		recipeView.render(model.state.recipe)
		addRecipeView.renderSuccess()
		window.history.pushState(null, "", `#${model.state.recipe.id}`)
		bookmarksView.render(model.state.bookmarks)

		await waitForaSeconds(1)
		addRecipeView.toggleWindow()
	} catch (err) {
		addRecipeView.renderError(err.message)
		console.log(err)
	}
}
