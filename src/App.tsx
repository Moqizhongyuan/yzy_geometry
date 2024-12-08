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
import { ThemeProvider as AntThemeProvider } from 'antd-style'
import { useContext } from 'react'
import ThemeContext from '@components/ThemeContext'

const App = () => {
  const context = useContext(ThemeContext)
  return (
    <AntThemeProvider
      themeMode={context?.value}
      theme={(appearance: string) => {
        // 如果是暗色模式，就返回暗色主题
        if (appearance === 'dark') {
          return {
            token: {
              colorPrimary: '#149684',
              colorBgBase: '#1b1b1b'
            }
          }
        }

        // 否则就返回默认主题
        return {
          token: {
            colorPrimary: '#41c6b0',
            colorBgBase: '#fff'
          }
        }
      }}
    >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/doc" element={<Doc />} />
        </Routes>
      </Router>
    </AntThemeProvider>
  )
}

export default App
