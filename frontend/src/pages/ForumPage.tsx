import { useState, useEffect, useMemo, useCallback } from 'react';
import ForumPostCard from '../components/forum/ForumPostCard';
import type { ForumPost } from '../components/forum/ForumPostCard';
import ForumCategoryFilter from '../components/forum/ForumCategoryFilter';
import type { ForumCategory } from '../components/forum/ForumCategoryFilter';
import CreatePostModal from '../components/forum/CreatePostModal';
import { useAuth } from '../contexts/authContext';
import {
    createForumPost,
    fetchForumPosts,
    POSTS_PER_PAGE,
    type ForumPostDoc,
} from '../firebase/forumService';
import type { DocumentSnapshot } from 'firebase/firestore';

// ─── Categories (static metadata) ──────────────────────────────────────────────

const CATEGORIES: ForumCategory[] = [
    { id: 'all', label: 'All Posts', icon: '📋' },
    { id: 'question', label: 'Questions', icon: '❓' },
    { id: 'discussion', label: 'Discussion', icon: '💬' },
    { id: 'showcase', label: 'Showcase', icon: '🏆' },
    { id: 'tutorial', label: 'Tutorials', icon: '📖' },
];

type SortOption = 'recent' | 'popular' | 'most-replies';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
    { id: 'recent', label: 'Recent' },
    { id: 'popular', label: 'Popular' },
    { id: 'most-replies', label: 'Most Replies' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Convert Firestore doc into the shape the card component expects. */
function toForumPost(doc: ForumPostDoc): ForumPost {
    return {
        id: doc.id,
        title: doc.title,
        author: doc.author,
        content: doc.content,
        tags: doc.tags,
        createdAt: doc.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
        replyCount: doc.replyCount,
        likeCount: doc.likeCount,
        isPinned: doc.isPinned,
    };
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function ForumPage() {
    const { currentUser } = useAuth();

    // Data state
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [cursorCache, setCursorCache] = useState<Map<number, DocumentSnapshot | null>>(
        () => new Map([[1, null]]) // page 1 starts from the beginning
    );

    // UI state
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));

    // ── Load posts from Firestore ───────────────────────────────────────────────

    const loadPage = useCallback(async (page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const cursor = cursorCache.get(page) ?? null;
            const result = await fetchForumPosts(POSTS_PER_PAGE, cursor);

            setPosts(result.posts.map(toForumPost));
            setTotalCount(result.totalCount);

            // Cache the cursor for the *next* page so we can navigate forward
            if (result.lastDoc) {
                setCursorCache((prev) => {
                    const next = new Map(prev);
                    next.set(page + 1, result.lastDoc);
                    return next;
                });
            }
        } catch (err) {
            console.error('Failed to load forum posts:', err);
            setError('Failed to load posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [cursorCache]);

    // Load first page on mount
    useEffect(() => {
        loadPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Entrance animation
    useEffect(() => { setIsVisible(true); }, []);
    useEffect(() => { document.title = 'Forum - NeuralForge'; }, []);

    // ── Page change handler ─────────────────────────────────────────────────────

    const goToPage = useCallback((page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        if (!cursorCache.has(page)) return; // safety: cursor must exist
        setCurrentPage(page);
        loadPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [totalPages, currentPage, cursorCache, loadPage]);

    // ── Filtering & sorting (client-side on current page) ───────────────────────

    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Category filter
        if (activeCategory !== 'all') {
            const catLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label.replace(/s$/, '') ?? '';
            result = result.filter((p) =>
                p.tags.some((t) => t.toLowerCase().includes(catLabel.toLowerCase()))
            );
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.content.toLowerCase().includes(q) ||
                    p.author.toLowerCase().includes(q)
            );
        }

        // Sort
        const pinned = result.filter((p) => p.isPinned);
        const unpinned = result.filter((p) => !p.isPinned);

        unpinned.sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    return b.likeCount - a.likeCount;
                case 'most-replies':
                    return b.replyCount - a.replyCount;
                case 'recent':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return [...pinned, ...unpinned];
    }, [posts, activeCategory, sortBy, searchQuery]);

    // ── Create handler ──────────────────────────────────────────────────────────

    const handleCreatePost = async (data: { title: string; content: string; tags: string[] }) => {
        if (!currentUser) return;

        try {
            await createForumPost({
                title: data.title,
                content: data.content,
                tags: data.tags,
                authorUid: currentUser.uid,
                authorName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
            });

            // Refresh the first page and navigate there to show the new post
            setCursorCache(new Map([[1, null]]));
            setCurrentPage(1);
            await loadPage(1);
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };


    return (
        <div className="min-h-screen w-full bg-[#060010] text-white pt-24 px-6 pb-16 relative">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] 
                      bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <div className="flex items-end justify-between mb-2">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-mono">Forum</h1>
                            <p className="text-gray-400 mt-1 text-sm">
                                Ask questions, share knowledge, and connect with the community.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            disabled={!currentUser}
                            title={!currentUser ? 'Sign in to create a post' : undefined}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                         transition-all duration-200 ease-out shrink-0
                         ${currentUser
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'
                                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Post
                        </button>
                    </div>
                </div>

                {/* search bar logic */}
                <div
                    className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 mb-5 
                      transition-all duration-700 delay-100
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    {/* search */}
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/40 rounded-lg
                         text-sm text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_8px_rgba(99,102,241,0.1)]
                         transition-all duration-200"
                        />
                    </div>

                    {/* sort */}
                    <div className="flex bg-gray-900/50 border border-gray-700/40 rounded-lg p-0.5 shrink-0">
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                           ${sortBy === opt.id
                                        ? 'bg-indigo-500/20 text-indigo-300'
                                        : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* filtering */}
                <div
                    className={`mb-6 transition-all duration-700 delay-200
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    <ForumCategoryFilter
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-gray-500 text-sm">Loading posts…</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-3">⚠️</div>
                            <p className="text-red-400 text-sm">{error}</p>
                            <button
                                onClick={() => loadPage(currentPage)}
                                className="mt-3 px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div
                            className={`text-center py-16 transition-all duration-700 delay-300
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        >
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-gray-400 text-sm">No posts found.</p>
                            <p className="text-gray-600 text-xs mt-1">Try a different filter or create a new post!</p>
                        </div>
                    ) : (
                        filteredPosts.map((post, idx) => (
                            <div
                                key={post.id}
                                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{ transitionDelay: `${300 + idx * 60}ms` }}
                            >
                                <ForumPostCard
                                    post={post}
                                    onClick={(p) => console.log('Navigate to post', p.id)}
                                />
                            </div>
                        ))
                    )}
                </div>

                {!isLoading && totalPages > 1 && (
                    <div
                        className={`flex items-center justify-center gap-2 mt-10 transition-all duration-700 delay-500
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    >
                        {/* Prev */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                         ${currentPage === 1
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show at most 7 page buttons with ellipsis
                            if (
                                totalPages > 7 &&
                                page !== 1 &&
                                page !== totalPages &&
                                Math.abs(page - currentPage) > 2
                            ) {
                                // Show ellipsis dot only once per gap
                                if (page === currentPage - 3 || page === currentPage + 3) {
                                    return (
                                        <span key={page} className="text-gray-600 px-1 select-none">…</span>
                                    );
                                }
                                return null;
                            }

                            const canNavigate = cursorCache.has(page);
                            return (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    disabled={!canNavigate && page !== currentPage}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                                     ${page === currentPage
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                            : canNavigate
                                                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                                : 'text-gray-700 cursor-not-allowed'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                         ${currentPage === totalPages
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* info */}
                {!isLoading && totalCount > 0 && (
                    <p className="text-center text-xs text-gray-600 mt-3">
                        Page {currentPage} of {totalPages} · {totalCount} {totalCount === 1 ? 'post' : 'posts'} total
                    </p>
                )}
            </div>

            <CreatePostModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreatePost}
            />
        </div>
    );
}