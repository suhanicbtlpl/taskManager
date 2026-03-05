import React from 'react'
import { Routes , Route } from 'react-router-dom'
import { Dashboard } from '../page/dashboard/Dashboard'
import { Staff } from '../page/staff/Staff'
export const SidebarRoute = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Dashboard/>}></Route>
            <Route path='/staff' element={<Staff/>}></Route>
        </Routes>
    </div>
  )
}
