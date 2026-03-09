
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthRoute } from './routes/AuthRoute'
import { AuthProvider } from './context/AuthContext'
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AuthRoute />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
