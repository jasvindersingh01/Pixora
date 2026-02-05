import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { assets } from '../assets';
import { AppContext } from '../context/AppContext';

export default function Navbar() {

    const { user, setShowLogin, logout, credit } = useContext(AppContext)
    const navigate = useNavigate();

    return (
        <>
            <div className='flex items-center justify-between py-2'>
                <div className="flex items-center">
                    <Link to="/" className='flex items-center'>
                        <img src="logo.png" className="w-28 sm:w-32 lg:w-38" />
                    </Link>
                </div>

                <div>
                    {
                        user ?
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <button onClick={() => navigate("/buy-credits")} className='flex items-center gap-2 cursor-pointer bg-purple-200 py-1.5 sm:py-3 px-4 sm:px-6 rounded-full hover:scale-105 transition-all duration-700'>
                                    <img className='w-5' src={assets.credit} alt="" />
                                    <p className='text-xs sm:text-sm font-medium text-gray-700'>Credits left: {credit}</p>
                                </button>
                                <p className='text-gray-700 max-sm:hidden pl-4'>Hi, {user.name}</p>
                                <div className='relative group'>
                                    <img src={assets.profile_icon} className='w-10' alt="" />
                                    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                        <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                                            <li onClick={logout} className='py-1 px-2 cursor-pointer pr-8'>
                                                Logout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='flex items-center justify-between gap-2 sm:gap-5'>
                                <p onClick={() => navigate("/buy-credits")} className="cursor-pointer">Pricing</p>
                                <button onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white px-8 sm:px-10 py-2 rounded-full cursor-pointer'>Login</button>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}