'use server'

import { createAdminClient } from '@/app/appwrite-session'
import { headers } from 'next/headers'
import { OAuthProvider } from 'node-appwrite'
import { redirect } from '@/navigation'

export async function signInWithGithub() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect(redirectUrl)
}

export async function signInWithGoogle() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )
  // @ts-ignore
  return redirect(redirectUrl)
}

export async function signInWithDiscord() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Discord,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect(redirectUrl)
}

export async function signInWithSpotify() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Spotify,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect(redirectUrl)
}

export async function signInWithTwitch() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Twitch,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect(redirectUrl)
}

export async function signInWithMicrosoft() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Microsoft,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect(redirectUrl)
}

export async function signInWithApple() {
  const { account } = await createAdminClient()

  const origin = headers().get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Apple,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect(redirectUrl)
}
