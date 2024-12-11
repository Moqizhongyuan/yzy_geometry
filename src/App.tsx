import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom'
import './styles/base.css'
import './styles/var.css'
import NavBar from './components/NavBar'
import { ThemeProvider as AntThemeProvider } from 'antd-style'
import React, { useContext, Suspense } from 'react'
import ThemeContext from '@components/ThemeContext'

const Home = React.lazy(() => import('./pages/home'))
const Detail = React.lazy(() => import('./pages/detail'))
const Doc = React.lazy(() => import('./pages/doc'))

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
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-center text-3xl">
              <div>Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/doc" element={<Doc />} />
          </Routes>
        </Suspense>
      </Router>
    </AntThemeProvider>
  )
}

export default App
