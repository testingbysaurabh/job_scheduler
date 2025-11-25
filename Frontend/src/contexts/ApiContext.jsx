import { createContext } from 'react'

export const ApiContext = createContext({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

export function ApiProvider({ children }) {
    const value = { baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000' }
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    )
}
