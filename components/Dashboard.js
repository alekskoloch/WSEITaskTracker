'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc , setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Dashboard() {
    const { currentUser, loading } = useAuth();
    const [tasks, setTasks] = useState(null);
    const [userDataObj, setUserDataObj] = useState({});
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
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

                    const dailyTasks = userData?.tasks?.[todayKey] || [];
                    setTasks(dailyTasks.length > 0 ? dailyTasks : null);
                }
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        }

        fetchTasks();
    }, [currentUser, todayKey]);

    const filteredTasks = tasks
    ? tasks.filter((task) => showCompletedTasks || task.status !== 'Done')
    : null;

    const toggleShowCompletedTasks = () => {
        setShowCompletedTasks((prev) => !prev);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setTaskModalVisible(true);
    };

    const closeTaskModal = () => {
        setTaskModalVisible(false);
        setSelectedTask(null);
    };

    const updateTaskStatus = async (status) => {
        if (!selectedTask || !currentUser) return;
    
        try {
            const updatedTasks = tasks.map((task) =>
                task.title === selectedTask.title ? { ...task, status } : task
            );
            setTasks(updatedTasks);
    
            const userDoc = doc(db, "users", currentUser.uid);
            const updatedData = {
                ...userDataObj,
                tasks: {
                    ...userDataObj.tasks,
                    [todayKey]: updatedTasks,
                },
            };
            await setDoc(userDoc, updatedData);
    
            closeTaskModal();
        } catch (error) {
            console.error("Error updating task status: ", error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!currentUser) {
        return <Login />;
    }

    return (
        <div className='flex flex-col flex-1 gap-4 sm:gap-8 md:gap-12'>
            <div className='grid grid-cols-1 bg-indigo-50 text-indigo-500 rounded-lg p-4'>
                <label className='flex items-center gap-2'>
                    <input
                        type="checkbox"
                        checked={showCompletedTasks}
                        onChange={toggleShowCompletedTasks}
                        className='w-4 h-4 accent-indigo-500'
                    />
                    <span className='text-sm sm:text-base'>Show Completed Tasks</span>
                </label>
            </div>
            <h4 className={'text-4xl sm:text-5xl md:text-6xl text-center ' + fugaz.className}>
                Welcome {userDataObj?.name || 'there'}! Here are your <span className='textGradient'>tasks</span> for today:
            </h4>

            <div className="flex flex-wrap justify-center gap-4 relative">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task, index) => {
                        const isVisible = showCompletedTasks || task.status !== 'Done';

                        return (
                            <div
                                key={index}
                                className={`flex justify-center w-full sm:w-auto max-w-[300px] ${
                                    isVisible
                                        ? 'opacity-100 scale-100 duration-500 transition-all '
                                        : 'opacity-0 scale-95 absolute pointer-events-none'
                                }`}
                            >
                                <button
                                    className={`p-4 text-indigo-500 rounded-lg duration-200 w-full ${
                                        task.status === 'Done'
                                            ? 'bg-green-50 greenShadow hover:bg-[lightgreen]'
                                            : 'bg-indigo-50 purpleShadow hover:bg-[lavender]'
                                    }`}
                                    onClick={() => handleTaskClick(task)}
                                >
                                    <p className={'font-medium text-lg ' + fugaz.className}>{task.title}</p>
                                    <p className="text-sm">{task.description}</p>
                                    <p className="text-xs">{task.status}</p>
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-indigo-500 text-2xl sm:text-3xl md:text-4xl w-full">
                        <p className={fugaz.className}>Nothing to do</p>
                    </div>
                )}
            </div>

            <Calendar completeData={userDataObj} handleSetTasks={() => {}} />

            {taskModalVisible && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md text-center">
                        <h2 className={"text-2xl font-bold mb-4 text-indigo-600 " + fugaz.className}>
                            Task Details
                        </h2>
                        <p className={"text-lg font-semibold mb-2 " + fugaz.className}>
                            {selectedTask.title}
                        </p>
                        <p className="text-sm mb-4">{selectedTask.description}</p>
                        <div className="flex justify-center gap-2 mb-4">
                            {['To Do', 'In Progress', 'Done'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateTaskStatus(status)}
                                    className={`px-4 py-2 rounded ${
                                        status === selectedTask.status
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-indigo-100 text-indigo-500'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-red-400 duration-200"
                            onClick={closeTaskModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
