import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function UserTable({ users, onToggleRole, isUpdating, updatingUserId }) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1419]/50 backdrop-blur-sm">
            <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead>
                    <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-white/5">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map(user => {
                        const isAdmin = user.role === 'admin';
                        const isCurrentlyUpdating = isUpdating && updatingUserId === user.id;

                        return (
                            <tr
                                key={user.id}
                                className="text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${isAdmin
                                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                            : 'bg-gradient-to-br from-gray-600 to-gray-700'
                                            }`}>
                                            {user.email?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.email}</p>
                                            <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${isAdmin
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                        {isAdmin ? 'Admin' : 'Standard'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <button
                                        onClick={() => onToggleRole(user)}
                                        disabled={isCurrentlyUpdating}
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isCurrentlyUpdating
                                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                            : isAdmin
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 hover:border-amber-500/50'
                                                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 hover:border-indigo-500/50'
                                            }`}
                                    >
                                        {isCurrentlyUpdating ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : isAdmin ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                                Demote to User
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                                Promote to Admin
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const usersCollectionRef = collection(db, "users");

        const unsubscribe = onSnapshot(
            usersCollectionRef,
            (snapshot) => {
                const usersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
                setIsLoading(false);
            },
            (err) => {
                console.error("Error fetching users:", err);
                setError("Failed to load user data.");
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleToggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'standard' : 'admin';
        const actionText = newRole === 'admin' ? 'promote' : 'demote';

        if (!window.confirm(`Are you sure you want to ${actionText} ${user.email} to ${newRole}?`)) {
            return;
        }

        setIsUpdating(true);
        setUpdatingUserId(user.id);
        setMessage(null);

        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, { role: newRole });
            setMessage({
                type: 'success',
                text: `${user.email} has been ${newRole === 'admin' ? 'promoted to admin' : 'demoted to standard user'}.`
            });
        } catch (err) {
            console.error("Error updating user role:", err);
            setMessage({
                type: 'error',
                text: err.message || 'An error occurred while updating the user role.'
            });
        } finally {
            setIsUpdating(false);
            setUpdatingUserId(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    // Stats for the header
    const adminCount = users.filter(u => u.role === 'admin').length;
    const standardCount = users.length - adminCount;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1033] to-[#0f172a] pt-8 pb-16 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                            <p className="text-gray-400 text-sm">Manage user roles and permissions</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-white mb-1">{users.length}</div>
                        <div className="text-sm text-gray-400">Total Users</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-purple-300 mb-1">{adminCount}</div>
                        <div className="text-sm text-purple-400/70">Administrators</div>
                    </div>
                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-gray-300 mb-1">{standardCount}</div>
                        <div className="text-sm text-gray-400/70">Standard Users</div>
                    </div>
                </div>

                {/* Message Banner */}
                {message && (
                    <div className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                        {message.type === 'success' ? (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {message.text}
                    </div>
                )}

                {/* Main Content */}
                {isLoading ? (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
                        <svg className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-400 text-sm">Loading user data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 border border-dashed border-red-500/30 rounded-xl bg-red-500/10">
                        <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-red-400 text-sm font-medium">Error: {error}</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-400 text-sm">No users found in the database.</p>
                    </div>
                ) : (
                    <UserTable
                        users={users}
                        onToggleRole={handleToggleRole}
                        isUpdating={isUpdating}
                        updatingUserId={updatingUserId}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminPanel;