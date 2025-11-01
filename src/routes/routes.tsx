import { Routes, Route } from 'react-router-dom'
import { Home, Projects, NotFound } from '@/pages/App'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}