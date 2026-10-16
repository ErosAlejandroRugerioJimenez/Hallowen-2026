import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/readability.css'
import './styles/experience.css'
import './styles/petals.css'
import './styles/event-details.css'
import './styles/mobile.css'
import './styles/memories.css'
import './styles/motion.css'
import './styles/supporters.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)



