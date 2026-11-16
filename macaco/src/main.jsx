import ReactDOM from 'react-dom/client'
import { App } from './app-core.jsx'

// Point d'entree. Dans le build d'origine ce createRoot etait inline a la fin
// du chunk principal ; il est isole ici pour que app-core reste un module.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
