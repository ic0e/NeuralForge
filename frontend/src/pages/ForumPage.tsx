import { useState, useEffect, useMemo } from 'react';
import ForumPostCard from '../components/forum/ForumPostCard';
import type { ForumPost } from '../components/forum/ForumPostCard';
import ForumCategoryFilter from '../components/forum/ForumCategoryFilter';
import type { ForumCategory } from '../components/forum/ForumCategoryFilter';
import CreatePostModal from '../components/forum/CreatePostModal';

// ─── Placeholder hardcoded data ────────────────────────────────

const CATEGORIES: ForumCategory[] = [
    { id: 'all', label: 'All Posts', icon: '📋' },
    { id: 'question', label: 'Questions', icon: '❓', count: 12 },
    { id: 'discussion', label: 'Discussion', icon: '💬', count: 8 },
    { id: 'showcase', label: 'Showcase', icon: '🏆', count: 3 },
    { id: 'tutorial', label: 'Tutorials', icon: '📖', count: 5 },
];

const SAMPLE_POSTS: ForumPost[] = [
    {
        id: '1',
        title: 'HARDCODED TEST: How to prevent overfitting in CNNs with small datasets?',
        author: 'alexm',
        content: 'I\'m training an image classifier on about 500 images per class and noticing my validation accuracy starts dropping after a few epochs. I\'ve tried dropout but it doesn\'t seem to be enough. Any tips?',
        tags: ['Question', 'CNN'],
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        replyCount: 7,
        likeCount: 15,
        isPinned: true,
    }
];

type SortOption = 'recent' | 'popular' | 'most-replies';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
    { id: 'recent', label: 'Recent' },
    { id: 'popular', label: 'Popular' },
    { id: 'most-replies', label: 'Most Replies' },
];

export default function ForumPage() {
    const [posts, setPosts] = useState<ForumPost[]>(SAMPLE_POSTS);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        document.title = 'Forum - NeuralForge';
    }, []);

    // ── Filtering & sorting ────────────────────────────────────────────────────

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

    // ── Create handler ─────────────────────────────────────────────────────────

    const handleCreatePost = (data: { title: string; content: string; tags: string[] }) => {
        const newPost: ForumPost = {
            id: String(Date.now()),
            title: data.title,
            author: 'you',
            content: data.content,
            tags: data.tags,
            createdAt: new Date().toISOString(),
            replyCount: 0,
            likeCount: 0,
        };
        setPosts((prev) => [newPost, ...prev]);
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen w-full bg-[#060010] text-white pt-24 px-6 pb-16 relative">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] 
                      bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* ── Header ──────────────────────────────────────────────────── */}
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
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 
                         text-white text-sm font-medium rounded-lg
                         transition-all duration-200 ease-out
                         shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                         shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Post
                        </button>
                    </div>
                </div>

                {/* ── Search + Sort bar ────────────────────────────────────────── */}
                <div
                    className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 mb-5 
                      transition-all duration-700 delay-100
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    {/* Search */}
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

                    {/* Sort */}
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

                {/* ── Category Filter ─────────────────────────────────────────── */}
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

                {/* ── Post List ───────────────────────────────────────────────── */}
                <div className="space-y-3">
                    {filteredPosts.length === 0 ? (
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
            </div>

            {/* ── Create Post Modal ────────────────────────────────────────── */}
            <CreatePostModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreatePost}
            />
        </div>
    );
}