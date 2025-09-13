'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const email = e.target.email.value
    const password = e.target.password.value

    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (err) {
      setError('Wrong credentials. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      onLogin()
    } catch (err) {
      setError('Google login failed.')
    }
  }

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to continue to the dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} id="login-form" className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="***********"  required />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {/* <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
        >
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
  )
}
