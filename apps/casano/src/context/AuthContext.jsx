import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { authApi } from '../lib/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user || null
            setUser(u)
            if (u) fetchProfile(u.id)
            else setLoading(false)
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user || null
            setUser(u)
            if (u) fetchProfile(u.id)
            else { setProfile(null); setLoading(false) }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId, retries = 2) {
        try {
            const { data } = await authApi.getProfile(userId);
            setProfile(data || null)
        } catch (err) {
            if (retries > 0) {
                await new Promise(r => setTimeout(r, 1000))
                return fetchProfile(userId, retries - 1)
            }
            console.warn('Profile fetch failed:', err)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = useCallback(async (updates) => {
        if (!user) return { error: new Error('Not logged in') }
        try {
            const { data } = await authApi.updateProfile(user.id, updates);
            if (data) setProfile(data)
            return { data }
        } catch (error) {
            return { error }
        }
    }, [user])

    async function signOut() {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfile, refetchProfile: () => user && fetchProfile(user.id) }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
