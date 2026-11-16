// Point d'entree. Dans le build d'origine ce createRoot etait inline a la fin
// du chunk principal.
import ReactDOM from 'react-dom/client'

import './styles/index.css'
import { App } from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
