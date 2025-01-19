import React from 'react'

export default function Loading() {
  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
        <i className="fa-solid text-slate-800 fa-spinner animate-spin text-indigo-600 text-8xl sm:text-7xl"></i>
    </div>
  )
}