import { API_URL, KEY, RES_PER_PAGE } from "./config"
import { AJAX } from "./helper"

import { async } from "regenerator-runtime"

export let state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
}
function init() {
	const isExist = JSON.parse(localStorage.getItem("bookmarks"))
	if (isExist) state.bookmarks = isExist
}
init()
function createRecipeObject(data) {
	let { recipe } = data.data
	return {
		id: recipe.id,
		title: recipe.title,
		image: recipe.image_url,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		ingredients: recipe.ingredients,
		cookingTime: recipe.cooking_time,
		servings: recipe.servings,
		...(recipe.key && { key: recipe.key }),
	}
}
export async function loadRecipe(id) {
	try {
		const url = API_URL.concat(id, "?key=", KEY)
		const data = await AJAX(url)
		state.recipe = createRecipeObject(data)

		if (state.bookmarks.some(el => el.id === state.recipe.id))
			state.recipe.bookmarked = true
		else state.recipe.bookmarked = false
	} catch (err) {
		throw err
	}
}
export async function loadSearchResults(query) {
	try {
		const url = API_URL.concat("?search=", query, "&key=", KEY)
		const data = await AJAX(url)
		state.search.results = data.data.recipes.map(recipe => ({
			id: recipe.id,
			title: recipe.title,
			image: recipe.image_url,
			publisher: recipe.publisher,
			...(recipe.key && { key: recipe.key }),
		}))
		state.search.query = query
		state.search.page = 1
	} catch (err) {
		throw err
	}
}
export function getSearchResultsPage(page = state.search.page) {
	state.search.page = page
	const start = RES_PER_PAGE * (page - 1)
	const end = RES_PER_PAGE * page

	return state.search.results.slice(start, end)
}
export function updateServings(num) {
	const servings = state.recipe.servings

	state.recipe.ingredients.forEach(ing => {
		ing.quantity = (ing.quantity * num) / servings
	})

	state.recipe.servings = num
}
export function addBookmark(recipe) {
	if (state.recipe.id !== recipe.id) return

	state.bookmarks.push(recipe)
	state.recipe.bookmarked = true

	persistBookmarks()
}
export function deleteBookmark(id) {
	const isExist = state.bookmarks.findIndex(el => el.id === id)
	if (isExist < 0 && state.recipe.id !== id) return

	state.bookmarks.splice(isExist, 1)
	state.recipe.bookmarked = false

	persistBookmarks()
}
function persistBookmarks() {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
}
export async function uploadRecipe(data) {
	try {
		const ingredients = data
			.filter(el => el[0].startsWith("ingredient") && el[1] !== "")
			.map(el => {
				const ings = el[1].split(",").map(n => n.trim())

				if (ings.length < 3)
					throw new Error(
						"Wrong ingredient fromat! Please use the correct format :)"
					)

				const [quantity, unit, description] = ings

				return {
					quantity: +quantity,
					unit,
					description,
				}
			})
		const formRecipes = Object.fromEntries(data)

		const recipe = {
			title: formRecipes.title,
			image_url: formRecipes.image,
			publisher: formRecipes.publisher,
			source_url: formRecipes.sourceUrl,
			ingredients,
			cooking_time: +formRecipes.cookingTime,
			servings: formRecipes.servings,
		}

		const newRecipe = await AJAX(API_URL.concat("?key=", KEY), recipe)
		state.recipe = createRecipeObject(newRecipe)
		addBookmark(state.recipe)
	} catch (err) {
		throw err
	}
}
