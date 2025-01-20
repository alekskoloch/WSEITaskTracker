'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Dashboard() {
    const { currentUser, loading } = useAuth();
    const [tasks, setTasks] = useState(null); // Taski na dzisiejszy dzień
    const [userDataObj, setUserDataObj] = useState({});
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    useEffect(() => {
        if (!currentUser) return;

        async function fetchTasks() {
            try {
                const userDoc = doc(db, "users", currentUser.uid);
                const docSnapshot = await getDoc(userDoc);

                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setUserDataObj(userData);

                    // Pobierz taski na dzisiejszy dzień
                    const dailyTasks = userData?.tasks?.[todayKey] || [];
                    setTasks(dailyTasks.length > 0 ? dailyTasks : null);
                }
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        }

        fetchTasks();
    }, [currentUser, todayKey]);

    if (loading) {
        return <Loading />;
    }

    if (!currentUser) {
        return <Login />;
    }

    return (
        <div className='flex flex-col flex-1 gap-4 sm:gap-8 md:gap-12'>
            <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg'>
                {['num_days', 'time_remaining', 'date'].map((status, statusIndex) => (
                    <div key={statusIndex} className='p-4 flex flex-col gap-1 sm:gap-2'>
                        <p className='font-medium uppercase text-xs sm:text-sm'>
                            {status.replaceAll('_', ' ')}
                        </p>
                        <p className={'text-base sm:text-lg ' + fugaz.className}>
                            {status === 'num_days' ? '14' : status === 'time_remaining' ? '12:13:14' : new Date().toDateString()}
                        </p>
                    </div>
                ))}
            </div>
            <h4 className={'text-4xl sm:text-5xl md:text-6xl text-center ' + fugaz.className}>
                Welcome {userDataObj?.name || 'there'}! Here are your <span className='textGradient'>tasks</span> for today:
            </h4>

            <div className='flex flex-wrap justify-center gap-4'>
                {tasks && tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <div key={index} className='flex justify-center w-full sm:w-auto max-w-[300px]'>
                            <button
                                className='p-4 bg-indigo-50 text-indigo-500 rounded-lg purpleShadow duration-200 hover:bg-[lavender] w-full'
                            >
                                <p className={'font-medium text-lg ' + fugaz.className}>
                                    {task.title}
                                </p>
                                <p className='text-sm'>{task.description}</p>
                                <p className='text-xs'>{task.status}</p>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className='text-center text-indigo-500 text-2xl sm:text-3xl md:text-4xl w-full'>
                        <p className={fugaz.className}>Nothing to do</p>
                    </div>
                )}
            </div>

            <Calendar completeData={userDataObj} handleSetTasks={() => {}} />
        </div>
    );
}
