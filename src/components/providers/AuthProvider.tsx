'use client'

import { AuthContext } from '@/context/AuthContext'

export default function AuthProvider({children, isLoggedIn, role,}: {
    children: React.ReactNode
    isLoggedIn: boolean
    role: string | null
}) {
    return (
        <AuthContext.Provider value={{ isLoggedIn, role }}>
            {children}
        </AuthContext.Provider>
    )
}