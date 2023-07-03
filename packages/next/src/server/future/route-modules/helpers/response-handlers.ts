import { appendMutableCookies } from '../../../web/spec-extension/adapters/request-cookies'
import { ResponseCookies } from '../../../web/spec-extension/cookies'

export function handleTemporaryRedirectResponse(
  url: string,
  mutableCookies: ResponseCookies
): Response {
  const headers = new Headers({ location: url })

  appendMutableCookies(headers, mutableCookies)

  return new Response(null, { status: 307, headers })
}

export function handleBadRequestResponse(): Response {
  return new Response(null, { status: 400 })
}

export function handleNotFoundResponse(): Response {
  return new Response(null, { status: 404 })
}

export function handleMethodNotAllowedResponse(): Response {
  return new Response(null, { status: 405 })
}

export function handleInternalServerErrorResponse(): Response {
  return new Response(null, { status: 500 })
}
