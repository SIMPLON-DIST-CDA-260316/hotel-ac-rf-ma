'use client'

import { createContext, useContext } from 'react'

export const AuthContext = createContext({
    isLoggedIn: false,
    role: null as string | null,
})

export const useAuth = () => useContext(AuthContext)