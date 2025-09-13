'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Login from './login/page'


const Page = () => {
  const router = useRouter()
  const [background, setBackground] = useState("url('/car.png')");

  useEffect(() => {
    const customBackground = localStorage.getItem('login-background');
    if (customBackground) {
      setBackground(`url(${customBackground})`);
    }
  }, []);

  const handleLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className='login-background' style={{ backgroundImage: background }}>
      <Login onLogin={handleLogin} />
    </div>
  )
}

export default Page


