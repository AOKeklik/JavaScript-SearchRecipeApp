import * as icon from "../../img/icons.svg"
import View from "../View"
import fracty from "fracty"

class RecipeView extends View {
	_containerElement = document.querySelector(".recipe")
	_errorMessage = "No recipes found for your query. Please try again!"

	addHandlerRender(handle) {
		;["load", "hashchange"].forEach(e => window.addEventListener(e, handle))
	}
	addHandlerUpdateServings(handle) {
		this._containerElement.addEventListener("click", function (e) {
			e.preventDefault()

			const btn = e.target.closest(".btn--tiny")
			if (!btn) return

			const num = +btn.dataset.updateTo
			handle(num)
		})
	}
	async addHandlerAddBookmark(handle) {
		const data = await fetch(
			"https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcd09"
		)
		this._containerElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--round")
			if (!btn) return
			handle()
		})
	}
	_generateMarkupIngredients(ing) {
		return ing
			.map(
				({ quantity, description, unit }) => `
                <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                    <use href="${icon}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${
						quantity ? fracty(quantity).toString() : ""
					}</div>
                    <div class="recipe__description">
                    <span class="recipe__unit">${unit}</span>
                    ${description}
                    </div>
                </li>
            `
			)
			.join("")
	}
	_generateMarkup() {
		return `
        <figure class="recipe__fig">
            <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
            <h1 class="recipe__title">
            <span>${this._data.title}</span>
            </h1>
        </figure>
    
        <div class="recipe__details">
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icon}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
				this._data.cookingTime
			}</span>
            <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icon}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
				this._data.servings
			}</span>
            <span class="recipe__info-text">servings</span>
    
            <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings" data-update-to="${
					this._data.servings - 1
				}">
                <svg>
                    <use href="${icon}#icon-minus-circle"></use>
                </svg>
                </button>
                <button class="btn--tiny btn--increase-servings" data-update-to="${
					this._data.servings + 1
				}">
                <svg>
                    <use href="${icon}#icon-plus-circle"></use>
                </svg>
                </button>
            </div>
            </div>
    
            <div class="recipe__user-generated ${
				this._data.key ? "" : "hidden"
			}">
                <svg>
                    <use href="${icon}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round">
            <svg class="">
                <use href="${icon}#icon-bookmark${
			this._data.bookmarked ? "-fill" : ""
		}"></use>
            </svg>
            </button>
        </div>
    
        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${this._generateMarkupIngredients(this._data.ingredients)}  
            </ul>
        </div>
    
        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
            directions at their website.
            </p>
            <a
            class="btn--small recipe__btn"
            href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
            target="_blank"
            >
            <span>Directions</span>
            <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
            </a>
        </div>
    `
	}
}

export default new RecipeView()
