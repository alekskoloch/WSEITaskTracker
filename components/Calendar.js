'use client'
import { Newsreader } from 'next/font/google';
import { gradients } from '@/utils/gradients';
import { baseTaskNumbers, demoData } from '@/utils/data';
import React from 'react'
import { useState } from 'react';
import { Fugaz_One }from 'next/font/google';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function Calendar(props) {

    const { demo, completeData, handleSetTasks } = props;

    const now = new Date();
    const currentMonth = now.getMonth();
    const [selectedMonth, setSelectMonth] = useState(months[currentMonth]);

    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const numericMonth = months.indexOf(selectedMonth);
    const data = completeData?.[selectedYear]?.[numericMonth] || {};
    console.log(completeData?.[selectedYear]?.[selectedMonth]);
    
    function handleIncrementMonth(val) {
        if (numericMonth + val < 0) {
            setSelectedYear(curr => curr - 1)
            setSelectMonth(months[months.length - 1])
        } else if (numericMonth + val > 11) {
            setSelectedYear(curr => curr + 1)
            setSelectMonth(months[0])
        } else {
            setSelectMonth(months[numericMonth + val])
        }
    }

    const monthNow = new Date(selectedYear, months.indexOf(selectedMonth), 1);
    const firstDayOfMonth = monthNow.getDay();
    const daysInMonth = new Date(selectedYear, months.indexOf(selectedMonth) + 1, 0).getDate();

    const daysToDisplay = firstDayOfMonth + daysInMonth;
    const numRows = (Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0));

    return (
        <div className='flex flex-col gap-2'>
            <div className='grid grid-cols-3 gap-4'>
                <button onClick={() => {
                    handleIncrementMonth(-1);
                }} className='ml-auto text-indigo-400 text-ls sm:text-xl duration-200 hover:opacity-60'>
                    <i className="fa-solid fa-circle-chevron-left"></i>
                </button>
                <p className={'text-center capitalized whitespace-nowrap textGradient ' + fugaz.className}>
                    {selectedMonth}, {selectedYear}
                </p>
                <button onClick={() => {
                    handleIncrementMonth(+1);
                }} className='mr-auto text-indigo-400 text-ls sm:text-xl duration-200 hover:opacity-60'>
                    <i className="fa-solid fa-circle-chevron-right"></i>
                </button>
            </div>
            <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
                {[...Array(numRows).keys()].map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className='grid grid-cols-7 gap-1'>
                            {days.map((dayOfWeek, dayOfWeekIndex) => {

                                let dayIndex = (rowIndex * 7) + dayOfWeekIndex - (firstDayOfMonth - 1);

                                let dayDisplay = dayIndex > daysInMonth ?
                                false : (row === 0 && dayOfWeekIndex < firstDayOfMonth) ?
                                false : true;
                                
                                let isToday = dayIndex === now.getDate();

                                if (!dayDisplay) {
                                    return (
                                        <div className='bg-white' key={dayOfWeekIndex} />
                                    )
                                }
                                
                                let color = demo ?
                                gradients.indigo[baseTaskNumbers[dayIndex]] :
                                dayIndex in data ?
                                gradients.indigo[data[dayIndex]] :
                                'white'
                                
                                return (
                                    <div style={{ background: color }} key={dayOfWeekIndex} className={'text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ' +
                                    (isToday ? ' border-indigo-400 ' : ' border-indigo-100 ') +
                                    (color === 'white' ? ' text-indigo-400 ' : ' text-white ')}>
                                        <p>{dayIndex}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
