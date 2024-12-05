import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom'
import Detail from './pages/detail'
import Home from './pages/home'
import './index.css'

const App = () => {
  return (
    <Router>
      <div className="h-8">nav</div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </Router>
  )
}

export default App
