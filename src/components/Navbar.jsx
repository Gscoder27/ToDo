import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between rounded-m shadow-lg bg-cyan-900 p-4 text-white text-center'>
      <div className='logo'>
        <span className='font-bold text-xl mx-8'>Taskify - List your task's</span>
      </div>
      <ul className='flex justify-center gap-4 mt-2 mx-9 my-2'>
        <li className='cursor-pointer hover:font-bold transition-all duration-75'>Home </li>
        <li className='cursor-pointer hover:font-bold transition-all duration-75'>Your Tasks</li>
        <li className='cursor-pointer hover:font-bold transition-all duration-75'>History</li>
        <li></li>
      </ul>     
    </nav>
  )
}

export default Navbar
