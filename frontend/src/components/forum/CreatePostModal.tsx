import { useState } from 'react';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: { title: string; content: string; tags: string[] }) => void;
    availableTags?: string[];
}

function CreatePostModal({ isOpen, onClose, onSubmit, availableTags = [] }: CreatePostModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const defaultTags = availableTags.length > 0
        ? availableTags
        : ['Question', 'Discussion', 'Tutorial', 'Bug', 'Showcase', 'Help'];

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) return;
        onSubmit({ title: title.trim(), content: content.trim(), tags: selectedTags });
        setTitle('');
        setContent('');
        setSelectedTags([]);
        onClose();
    };

    const canSubmit = title.trim().length > 0 && content.trim().length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-6xl max-h-4xl overflow-y-auto mx-4 bg-[#0f1629] border border-gray-700/60 
                      rounded-2xl shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/40">
                    <h2 className="text-lg font-semibold text-white">Create a Post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's your question or topic?"
                            className="w-full px-3.5 py-2.5 bg-gray-900/60 border border-gray-700/50 rounded-lg
                         text-white text-sm placeholder-gray-500
                         focus:outline-none focus:border-indigo-500/60 focus:shadow-[0_0_8px_rgba(99,102,241,0.15)]
                         transition-all duration-200"
                            maxLength={120}
                        />
                        <div className="text-right text-[11px] text-gray-600 mt-1">{title.length}/120</div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Describe your question or share your thoughts..."
                            rows={5}
                            className="w-full px-3.5 py-2.5 bg-gray-900/60 border border-gray-700/50 rounded-lg
                         text-white text-sm placeholder-gray-500 resize-y
                         focus:outline-none focus:border-indigo-500/60 focus:shadow-[0_0_8px_rgba(99,102,241,0.15)]
                         transition-all duration-200"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-1.5">
                            {defaultTags.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-200
                               ${isSelected
                                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                                : 'bg-gray-800/40 text-gray-500 border-gray-700/30 hover:text-gray-300 hover:border-gray-600/50'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700/40">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white
                       transition-colors duration-200 rounded-lg hover:bg-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200
                       ${canSubmit
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'
                                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePostModal;
