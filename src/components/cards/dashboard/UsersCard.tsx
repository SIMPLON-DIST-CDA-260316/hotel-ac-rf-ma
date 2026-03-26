'use client'

import { useState, useEffect } from 'react'

type User = {
    id: string
    name: string
    email: string
    role: string
}

const ROLES = ['admin', 'manager', 'user']

export default function UsersCard() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [userEnEdition, setUserEnEdition] = useState<string | null>(null)
    const [userEdit, setUserEdit] = useState<User | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            setLoading(true)
            const res = await fetch('/api/users')
            if (res.ok) {
                const data: User[] = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error)
        } finally {
            setLoading(false)
        }
    }

    function startEditUser(user: User) {
        setUserEnEdition(user.id)
        setUserEdit({ ...user })
    }

    async function saveUser() {
        if (!userEdit) return
        try {
            const res = await fetch(`/api/users/${userEdit.id}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userEdit.name,
                    email: userEdit.email,
                    role: userEdit.role
                })
            })

            if (!res.ok) throw new Error('Erreur lors de la mise à jour')

            setUsers(users.map(u => u.id === userEdit.id ? userEdit : u))
            setUserEnEdition(null)
            setUserEdit(null)
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error)
            alert('Erreur lors de la sauvegarde')
        }
    }

    async function deleteUser(id: string) {
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Erreur lors de la suppression')
            setUsers(users.filter(u => u.id !== id))
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            alert('Erreur lors de la suppression')
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-subheading text-lg font-semibold text-brand-forest">
                    Utilisateurs
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Nom</th>
                            <th className="font-body text-xs text-brand-slate font-medium uppercase tracking-wide text-left px-6 py-3">Rôle</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="font-body text-sm text-brand-slate text-center px-6 py-8">
                                    Chargement…
                                </td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                                {userEnEdition !== user.id ? (
                                    <>
                                        <td className="font-body text-sm text-brand-forest px-6 py-4">{user.name}</td>
                                        <td className="font-body text-sm text-brand-slate px-6 py-4">{user.role}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => startEditUser(user)}
                                                    className="font-body text-xs text-brand-mid hover:text-brand-dark font-medium transition-colors px-3 py-1.5 rounded-lg border border-brand-mid/30 hover:border-brand-mid"
                                                >
                                                    Éditer
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="font-body text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-400"
                                                >
                                                    Supprimer
                                                </button>

                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="font-body text-sm text-brand-forest px-6 py-4">{user.name}</td>
                                        <td className="px-6 py-3">
                                            <select
                                                value={userEdit?.role}
                                                onChange={(e) => setUserEdit({ ...userEdit!, role: e.target.value })}
                                                className="font-body border border-brand-mid/50 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-mid"
                                            >
                                                {ROLES.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={saveUser}
                                                    className="font-body text-xs text-white bg-brand-mid hover:bg-brand-dark font-medium transition-colors px-3 py-1.5 rounded-lg"
                                                >
                                                    Valider
                                                </button>
                                                <button
                                                    onClick={() => setUserEnEdition(null)}
                                                    className="font-body text-xs text-brand-slate hover:text-brand-forest transition-colors px-3 py-1.5 rounded-lg border border-gray-200"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}