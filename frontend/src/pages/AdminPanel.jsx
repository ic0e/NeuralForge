import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function UserTable({ users, onToggleRole, isUpdating, updatingUserId }) {
    return (
        <div className="overflow-x-auto rounded-md border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead>
                    <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#283149]">
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map(user => {
                        const isAdmin = user.role === 'admin';
                        const isCurrentlyUpdating = isUpdating && updatingUserId === user.id;

                        return (
                            <tr
                                key={user.id}
                                className="text-white hover:bg-[#283149] transition duration-150"
                            >
                                <td className="px-4 py-4">{user.email}</td>
                                <td className="px-4 py-4">
                                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${isAdmin
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-600 text-gray-300'
                                        }`}>
                                        {user.role || 'standard'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <button
                                        onClick={() => onToggleRole(user)}
                                        disabled={isCurrentlyUpdating}
                                        className={`flex items-center gap-1 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-all duration-200 ${isCurrentlyUpdating
                                                ? 'bg-gray-600 cursor-not-allowed'
                                                : isAdmin
                                                    ? 'bg-amber-600/50 hover:bg-amber-600'
                                                    : 'bg-indigo-600/50 hover:bg-indigo-600'
                                            }`}
                                    >
                                        {isCurrentlyUpdating
                                            ? 'Updating...'
                                            : isAdmin
                                                ? 'Demote to User'
                                                : 'Promote to Admin'}
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

    return (
        <div className="bg-[#1e2538] rounded-md p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.214-.016-.425-.045-.632M10 12l2-2m0 0l2 2m-2-2v8m-4-8v8a4 4 0 004 4h4a4 4 0 004-4v-8m-4-8l2 2m0 0l2-2m-2 2v-8m-4 8v-8a4 4 0 004 4h4a4 4 0 004-4v-8" />
                </svg>
                <h2 className="text-xl font-semibold text-white">Admin Panel: Role Management</h2>
            </div>

            <p className="text-gray-400 text-sm mb-6">Manage user roles ({users.length} total users).</p>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    {message.text}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                    <p className="text-gray-400 text-sm">Loading user data...</p>
                </div>
            ) : error ? (
                <div className="text-center py-6 border-2 border-dashed border-red-500/50 rounded-lg bg-red-900/10">
                    <p className="text-red-400 text-sm">Error: {error}</p>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354l.354.354m-2.708 0l-.354.354M12 4.354a8 8 0 00-7.646 9.646l.707.707m0 0l-.707.707M12 4.354h.001M12 4.354v.001m0 0l.354.354m-2.708 0l-.354.354m-.354-.354l.354-.354M12 4.354v.001M12 4.354h.001" />
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
    );
}

export default AdminPanel;