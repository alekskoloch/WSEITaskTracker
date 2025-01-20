'use client';
import { Newsreader } from 'next/font/google';
import { gradients } from '@/utils/gradients';
import { baseTaskNumbers } from '@/utils/data';
import React, { useState } from 'react';
import { Fugaz_One } from 'next/font/google';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function Calendar({ completeData }) {
    const { currentUser } = useAuth();
    const now = new Date();
    const currentMonth = now.getMonth();

    const [selectedMonth, setSelectMonth] = useState(months[currentMonth]);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [taskModalVisible, setTaskModalVisible] = useState(false); 
    const [taskDetails, setTaskDetails] = useState({ title: "", description: "", status: "To Do" });

    let isDemo = false;

    const numericMonth = months.indexOf(selectedMonth);
    let data = {};

    const pathname = usePathname();
    if (pathname === '/') {
        data = baseTaskNumbers;
        isDemo = true;
    }
    else {
        const tasks = completeData?.tasks || {};
        Object.keys(tasks).forEach((taskDate) => {
            const [year, month, day] = taskDate.split('-');
            if (year == selectedYear && month == numericMonth + 1) {
                data[day] = tasks[taskDate].length;
            }
        });
    }

    

    function handleIncrementMonth(val) {
        if (numericMonth + val < 0) {
            setSelectedYear(curr => curr - 1);
            setSelectMonth(months[months.length - 1]);
        } else if (numericMonth + val > 11) {
            setSelectedYear(curr => curr + 1);
            setSelectMonth(months[0]);
        } else {
            setSelectMonth(months[numericMonth + val]);
        }
    }

    const monthNow = new Date(selectedYear, numericMonth, 1);
    const firstDayOfMonth = monthNow.getDay();
    const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();

    const daysToDisplay = firstDayOfMonth + daysInMonth;
    const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

    async function handleAddTask() {
        if (!taskDetails.title) {
            alert("Title is required!");
            return;
        }

        if (!currentUser || !currentUser.uid) {
            alert("User not logged in!");
            return;
        }

        const taskDateKey = `${selectedYear}-${numericMonth + 1}-${selectedDay}`;
        const userDoc = doc(db, "users", currentUser.uid);

        try {
            await updateDoc(userDoc, {
                [`tasks.${taskDateKey}`]: arrayUnion({
                    ...taskDetails,
                    date: taskDateKey,
                    createdAt: new Date().toISOString(),
                }),
            });
            setTaskModalVisible(false);
            setTaskDetails({ title: "", description: "", status: "To Do" });
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='grid grid-cols-3 gap-4'>
                <button
                    onClick={() => handleIncrementMonth(-1)}
                    className='ml-auto text-indigo-400 text-ls sm:text-xl duration-200 hover:opacity-60'>
                    <i className="fa-solid fa-circle-chevron-left"></i>
                </button>
                <p className={'text-center capitalized whitespace-nowrap textGradient ' + fugaz.className}>
                    {selectedMonth}, {selectedYear}
                </p>
                <button
                    onClick={() => handleIncrementMonth(+1)}
                    className='mr-auto text-indigo-400 text-ls sm:text-xl duration-200 hover:opacity-60'>
                    <i className="fa-solid fa-circle-chevron-right"></i>
                </button>
            </div>
            <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
                {[...Array(numRows).keys()].map((row, rowIndex) => (
                    <div key={rowIndex} className='grid grid-cols-7 gap-1'>
                        {days.map((_, dayOfWeekIndex) => {
                            const dayIndex = rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);

                            if (dayIndex <= 0 || dayIndex > daysInMonth) {
                                return <div className='bg-white' key={dayOfWeekIndex} />;
                            }

                            const isToday = dayIndex === now.getDate() && selectedYear === now.getFullYear() && numericMonth === now.getMonth();
                            const color = dayIndex in data ? gradients.indigo[data[dayIndex]] : 'white';

                            return (
                                <div
                                    key={dayOfWeekIndex}
                                    style={{ background: color }}
                                    className={`text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg duration-200 transform hover:scale-105 ${
                                        isToday ? 'border-indigo-400' : 'border-indigo-100'
                                    } ${color === 'white' ? 'text-indigo-400' : ''} ${(isDemo ? '' : 'cursor-pointer')}`}
                                    onClick={() => {
                                        if (isDemo) return;
                                        setSelectedDay(dayIndex);
                                        setTaskModalVisible(true);
                                    }}
                                >
                                    <span>{dayIndex}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {taskModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Add Task</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={taskDetails.title}
                                    onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    value={taskDetails.description}
                                    onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                    placeholder="Enter task description"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    value={taskDetails.status}
                                    onChange={(e) => setTaskDetails({ ...taskDetails, status: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTaskModalVisible(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
