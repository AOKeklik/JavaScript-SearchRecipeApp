import { TIMEOUT_SEC } from "./config"

import { async } from "regenerator-runtime"

export function timeout(s) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(
				new Error(`Request took too long! Timeout after ${s} second`)
			)
		}, s * 1000)
	})
}
export function waitForaSeconds(s) {
	return new Promise((resolve, _) => {
		setTimeout(() => resolve("hh"), s * 1000)
	})
}

export async function AJAX(url, uploadData = undefined) {
	try {
		const fetchApi = uploadData
			? fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(uploadData),
			  })
			: fetch(url)
		const res = await Promise.race([fetchApi, timeout(TIMEOUT_SEC)])
		const data = await res.json()

		if (!res.ok) throw new Error(`${(res.status, data.message)}`)

		return data
	} catch (err) {
		throw err
	}
}
