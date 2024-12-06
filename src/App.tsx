import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom'
import Detail from './pages/detail'
import Home from './pages/home'
import './styles/base.css'
import './styles/var.css'
import NavBar from './components/NavBar'
import Doc from './pages/doc'

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/docs" element={<Doc />} />
      </Routes>
    </Router>
  )
}

export default App
