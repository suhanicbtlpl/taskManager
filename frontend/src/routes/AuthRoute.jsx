import React from 'react'
import { Sidebar } from '../components/sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'
import { Role } from '../pages/Role'
import { RoleForm } from '../pages/RoleForm'
import { TaskForm } from '../pages/task/TaskForm'
import { Login } from '../pages/Login'
import { Task } from '../pages/task/Task'
// import { hasPermission } from '../utils/Permission'
// import { useAuth } from '../context/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { Staff } from '../pages/staff/Staff'
import { StaffForm } from '../pages/staff/StaffForm'
import AdminLayout from '../layouts/adminLayout'
import { NoPage } from '../pages/NoPage'
import { Project } from '../pages/Project'
import { ProjectForm } from '../pages/ProjectForm'
import { Document } from '../pages/Document'
import { DocumentForm } from "../pages/DocumentForm";
import { DocumentRequests } from '../pages/DocumentRequests';
// export const AuthRoute = () => {
//     // const { user } = useAuth();
//     // const can = (permission) => hasPermission(user.user, permission);
//     return (
//         <div>
//             <Routes >
//                 <Route path='/' element={<Sidebar />}>

//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute permission="VIEW_DASHBOARD"> :
//                                 <Dashboard />
//                             </ProtectedRoute>
//                         }
//                     />
//                     <Route
//                         path="/staff"
//                         element={
//                             <ProtectedRoute permission="VIEW_STAFF">
//                                 <Staff />
//                             </ProtectedRoute>
//                         }
//                     >
//                         <Route
//                             path="createStaff"
//                             element={<StaffRoute />}
//                         />
//                     </Route>
//                     <Route path='/role' element={<Role />}></Route>
//                     <Route path='/task' element={<Task />}></Route>
//                     {/* <Route path='/staff' element={<Staff />}> */}

//                     {/* </Route> */}
//                 </Route>
//             </Routes>
//         </div >
//     )
// }

export const AuthRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<Navigate to="/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            // <ProtectedRoute permission="VIEW_DASHBOARD">
            <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/noPage"
          element={<NoPage />
          }
        />

        {/* Just include StaffRoute */}
        <Route
          path="staff"
          element={
            <ProtectedRoute permission="VIEW_STAFF">
              <Staff />
            </ProtectedRoute>
          }
        />

        <Route
          path="staff/create"
          element={
            <ProtectedRoute permission="CREATE_STAFF">
              <StaffForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="staff/update/:id"
          element={
            <ProtectedRoute permission="UPDATE_STAFF">
              <StaffForm />
            </ProtectedRoute>
          }
        />


        <Route
          path="role"
          element={
            <ProtectedRoute permission="VIEW_ROLE">
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="role/create"
          element={
            <ProtectedRoute permission="CREATE_ROLE">
              <RoleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="role/update/:id"
          element={
            <ProtectedRoute permission="UPDATE_ROLE">
              <RoleForm />
            </ProtectedRoute>
          }
        />

        {/* Permission routes removed as requested */}
        <Route
          path="task"
          element={
            <ProtectedRoute permission="VIEW_TASK">
              <Task />
            </ProtectedRoute>
          }
        />
        <Route
          path="task/create"
          element={
            <ProtectedRoute permission="CREATE_TASK">
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="task/update/:id"
          element={
            <ProtectedRoute permission="UPDATE_TASK">
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="project"
          element={
            <ProtectedRoute permission="VIEW_PROJECT">
              <Project />
            </ProtectedRoute>
          }
        />

        <Route
          path="project/create"
          element={
            <ProtectedRoute permission="CREATE_PROJECT">
              <ProjectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="project/update/:id"
          element={
            <ProtectedRoute permission="UPDATE_PROJECT">
              <ProjectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="document"
          element={
            <ProtectedRoute permission="VIEW_DOCUMENT">
              <Document />
            </ProtectedRoute>
          }
        />

        <Route
          path="document/create"
          element={
            <ProtectedRoute permission="CREATE_DOCUMENT">
              <DocumentForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="document-requests"
          element={
            <ProtectedRoute permission="APPROVE_DOCUMENT">
              <DocumentRequests />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
