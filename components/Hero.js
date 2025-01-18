import React from 'react'
import Button from './Button';
import Calendar from './Calendar';
import { Fugaz_One }from 'next/font/google';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Hero() {
  return (
    <div className='py-4 md:py-10 flex flex-col gap-4 sm:gap-8'>
        <h1 className={'text-5xl sm:text-text-6xl md:text-7 text-center ' + fugaz.className}>
            <span className={'textGradient'}>WSEI Next.js App </span>helps you track your <span className={'textGradient'}>tasks!</span>
        </h1>
        <p className={'text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]'}>Create your account to start <span className={'font-semibold'}>tracking your tasks and projects</span>.</p>
        <div className='grid grid-cols-2 gap-4 w-fit mx-auto'>
            <Button text="Sing Up" />
            <Button text="Login" dark />
        </div>
        <Calendar />
    </div>
  )
}
