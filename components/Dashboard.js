import React from 'react'
import Calendar from './Calendar';
import { Fugaz_One }from 'next/font/google';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {

    const statuses = {
        num_days: 14,
        time_remaining: '12:13:14',
        date: (new Date()).toDateString()
    }

    const tasks = {
        task_1: {
            name: 'Task 1',
            description: 'Description 1',
            status: 'in_progress'
        },
        task_2: {
            name: 'Task 2',
            description: 'Description 2',
            status: 'in_progress'
        },
        task_3: {
            name: 'Task 3',
            description: 'Description 3',
            status: 'not_started'
        },
    }

    return (
        <div className='flex flex-col flex-1 gap-4 sm:gap-8 md:gap-12'>
            <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg'>
                {Object.keys(statuses).map((status, statusIndex) => {
                    return (
                        <div key={statusIndex} className='p-4 flex flex-col gap-1 sm:gap-2'>
                            <p className='font-medium upperccase text-xs sm:text-sm'>{status.replaceAll('_', ' ')}</p>
                            <p className={'text-base sm:text-lg ' + fugaz.className}>{statuses[status]}</p>
                        </div>
                    )
                })}
            </div>
            <h4 className={'text-4xl sm:text-5xl md:text-6xl text-center ' + fugaz.className}>
                Welcome! Here are your <span className='textGradient'>tasks</span> for today:
            </h4>
            <div className='grid grid-cols-1 md:grid-col-5 gap-4'>
                {Object.keys(tasks).map((task, taskIndex) => {
                    return (
                        <button key={taskIndex} className='p-4 bg-indigo-50 text-indigo-500 rounded-lg purpleShadow duration-200 hover:bg-[lavender]'>
                            <p className={'font-medium text-lg ' + fugaz.className }>{tasks[task].name}</p>
                            <p className='text-sm'>{tasks[task].description}</p>
                            <p className='text-xs'>{tasks[task].status}</p>
                        </button>
                    )
                })}
            </div>
            <Calendar />
        </div>
    )
}