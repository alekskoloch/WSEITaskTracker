'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';


const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {

    const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
    const [data, setData] = useState({});
    const now = new Date();
    
    async function handleSetTasks(count) {

        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();

        try {
            const newData = {...userDataObj};

            if (!newData?.[year]) {
                newData[year] = {};
            }

            if (!newData[year]?.[month]) {
                newData[year][month] = {};
            }

            newData[year][month][day] = count;
            setData(newData);
            setUserDataObj(newData);
            const docRef = doc(db, 'users', currentUser.uid);
            const res = await setDoc(docRef, {
                [year]: {
                    [month]: {
                        [day]: count
                    }
                }
            }, { merge: true });
        } catch(err) {
            console.log('Failed to set data:', err.message);
        }
    }

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

    useEffect(() => {
        if (!currentUser || !userDataObj) {
            return;
        }
        setData(userDataObj);
    }, [currentUser, userDataObj]);

    if (loading) {
        return <Loading />
    }

    if (!currentUser) {
        return <Login />
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
                        <button onClick={() => {
                            const currentTaskCount = taskIndex + 1;
                            handleSetTasks(currentTaskCount);
                        }} key={taskIndex} className='p-4 bg-indigo-50 text-indigo-500 rounded-lg purpleShadow duration-200 hover:bg-[lavender]'>
                            <p className={'font-medium text-lg ' + fugaz.className }>{tasks[task].name}</p>
                            <p className='text-sm'>{tasks[task].description}</p>
                            <p className='text-xs'>{tasks[task].status}</p>
                        </button>
                    )
                })}
            </div>
            <Calendar completeData={data} handleSetTasks={handleSetTasks} />
        </div>
    )
}