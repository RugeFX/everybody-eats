import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../../lib/store'

export const Route = createFileRoute('/authed/')({
  beforeLoad: async ({ location }) => {
    if (!useAuthStore.getState().token) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => <div>You're authed!</div>,
})
