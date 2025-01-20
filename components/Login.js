'use client'
import React, { useState } from 'react'
import Button from './Button';
import { Fugaz_One }from 'next/font/google';
import { useAuth } from '../context/AuthContext';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const { signup, login } = useAuth();

  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      return;
    }
    setAuthenticating(true)
    try {
        if (isRegister) {
            console.log('Signing up a new user')
            await signup(name, email, password)
        } else {
            console.log('Logging in existing user')
            await login(email, password)
        }

    } catch (err) {
        console.log(err.message)
    } finally {
        setAuthenticating(false)
    }
  }


  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
        <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>{!isRegister ? 'Log In' : 'Register'}</h3>
        <p>You&#39;re one step away!</p>

        {isRegister && (
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-800 focus:border-indigo-800 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' 
            placeholder="Name" 
          />
        )}

        <input value={email} onChange={(e) => {
            setEmail(e.target.value);
        }} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-800 focus:border-indigo-800 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none ' placeholder="Email" />
        <input value={password} type='password' onChange={(e) => {
            setPassword(e.target.value);
        }} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-800 focus:border-indigo-800 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none ' placeholder="Password" />
        <div className='max-w-[400px] w-full mx-auto'>
            <Button clickHandler={handleSubmit} text={authenticating ? "Submitting" : "Submit"} full/>
        </div>
        <p className='text-center'>
            {!isRegister ? 'Don\'t have an account? ' : 'Already have an account? '}<button onClick={() => {
              setIsRegister(!isRegister);
            } } className={'text-indigo-600 ' + fugaz.className}>{!isRegister ? 'Sign up' : 'Sign in'}</button>
        </p>
    </div>
  )
}
