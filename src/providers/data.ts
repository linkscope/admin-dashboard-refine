import graphQLDataProvider, { GraphQLClient, liveProvider as graphQLiveProvider } from '@refinedev/nestjs-query'
import type { GraphQLFormattedError } from 'graphql'
import { createClient } from 'graphql-ws'

export const API_URL = 'https://api.crm.refine.dev/graphql'
export const WS_URL = 'wss://api.crm.refine.dev/graphql'

const fetcher = async (url: string, options: RequestInit) => {
	const token = localStorage.getItem('access_token')
	const headers = (options?.headers as Record<string, string>) || {}

	return fetch(url, {
		...options,
		headers: {
			...headers,
			Authorization: headers?.Authorization || `Bearer ${token}`,
			'Content-Type': 'application/json',
			'Apollo-Require-Preflight': 'true',
		},
	})
}

const getGraphQLErrors = (body: Record<'errors', GraphQLFormattedError[] | undefined>) => {
	if (!body) {
		return {
			message: 'Unknown Error',
			statusCode: 'INTERNAL_SERVER_ERROR',
		}
	}

	if ('errors' in body) {
		const message = body.errors?.map((err) => err.message).join('') || JSON.stringify(body.errors)
		const statusCode = (body.errors?.[0]?.extensions?.code as number) || 500

		return {
			message,
			statusCode,
		}
	}

	return null
}

export const client = new GraphQLClient(API_URL, {
	fetch: async (url: string, options: RequestInit) => {
		try {
			const response = await fetcher(url, options)
			const responseClone = response.clone()
			const body = await responseClone.json()
			const errors = getGraphQLErrors(body)

			if (errors) {
				console.error(errors.message)
				throw errors.message
			}

			return response
		} catch (e) {
			return Promise.reject(new Error(e as string))
		}
	},
})

export const wsClient =
	typeof window === 'undefined'
		? undefined
		: createClient({
				url: WS_URL,
				connectionParams: () => {
					const token = localStorage.getItem('access_token')
					return {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				},
			})

export const dataProvider = graphQLDataProvider(client)
export const liveProvider = wsClient ? graphQLiveProvider(wsClient) : undefined
