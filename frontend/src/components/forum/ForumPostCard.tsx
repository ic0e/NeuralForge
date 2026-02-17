

export interface ForumPost {
    id: string;
    title: string;
    author: string;
    content: string;
    tags: string[];
    createdAt: string;
    replyCount: number;
    likeCount: number;
    isPinned?: boolean;
}

interface ForumPostCardProps {
    post: ForumPost;
    onClick?: (post: ForumPost) => void;
}

function ForumPostCard({ post, onClick }: ForumPostCardProps) {
    const timeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div
            className={`group relative bg-gradient-to-b from-gray-900/60 to-gray-900/20 
                  border rounded-xl p-5 cursor-pointer
                  transition-all duration-300 ease-out
                  ${post.isPinned
                    ? 'border-purple-500/40 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10'
                    : 'border-gray-700/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
            onClick={() => onClick?.(post)}
        >
            {/* Pinned indicator */}
            {post.isPinned && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-purple-400 text-xs font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.617 1.738 5.42-1.985.496-1.738-5.42-.453.227a1 1 0 01-.894 0L10 6.871l-3.882 1.941a1 1 0 01-.894 0l-.453-.227-1.738 5.42-1.985-.496 1.738-5.42-1.233-.617a1 1 0 01.894-1.79l1.599.8L8 4.323V3a1 1 0 011-1h2z" />
                    </svg>
                    Pinned
                </div>
            )}

            {/* Title & Author */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 
                        flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                    {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 
                         transition-colors duration-200 truncate">
                        {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="text-gray-400">{post.author}</span>
                        <span>·</span>
                        <span>{timeAgo(post.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Preview content */}
            <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
                {post.content}
            </p>

            {/* Tags & Stats */}
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-[11px] font-medium rounded-md
                         bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {/* Replies */}
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.replyCount}
                    </div>
                    {/* Likes */}
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likeCount}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForumPostCard;
