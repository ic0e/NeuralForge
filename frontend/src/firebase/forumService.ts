import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getCountFromServer,
    serverTimestamp,
    type DocumentSnapshot,
    type QueryDocumentSnapshot,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';


export interface ForumPostData {
    title: string;
    author: string;
    authorUid: string;
    content: string;
    tags: string[];
    createdAt: Timestamp | null;
    replyCount: number;
    likeCount: number;
    isPinned: boolean;
}

export interface ForumPostDoc extends ForumPostData {
    id: string;
}

const COLLECTION_NAME = 'forumPosts';
export const POSTS_PER_PAGE = 10;


function docToPost(doc: QueryDocumentSnapshot): ForumPostDoc {
    const data = doc.data() as ForumPostData;
    return { id: doc.id, ...data };
}

// Create

export async function createForumPost(post: {
    title: string;
    content: string;
    tags: string[];
    authorUid: string;
    authorName: string;
}): Promise<ForumPostDoc> {
    const docData: Omit<ForumPostData, 'id'> = {
        title: post.title,
        content: post.content,
        tags: post.tags,
        author: post.authorName,
        authorUid: post.authorUid,
        createdAt: serverTimestamp() as unknown as Timestamp,
        replyCount: 0,
        likeCount: 0,
        isPinned: false,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);

    // Return an optimistic version so the UI can show it immediately
    return {
        id: docRef.id,
        ...docData,
        createdAt: Timestamp.now(), // approximate until next fetch
    };
}

// read

export interface PaginatedResult {
    posts: ForumPostDoc[];
    lastDoc: DocumentSnapshot | null;    // cursor for next page
    totalCount: number;
}

// boilerplate code from docs
/**
 * Fetch a single page of forum posts, ordered newest-first.
 *
 * @param pageSize   – how many posts to fetch (default POSTS_PER_PAGE)
 * @param afterDoc   – the last DocumentSnapshot from the previous page (null for page 1)
 */
export async function fetchForumPosts(
    pageSize: number = POSTS_PER_PAGE,
    afterDoc: DocumentSnapshot | null = null,
): Promise<PaginatedResult> {
    const col = collection(db, COLLECTION_NAME);

    // build the query
    let q = afterDoc
        ? query(col, orderBy('createdAt', 'desc'), startAfter(afterDoc), limit(pageSize))
        : query(col, orderBy('createdAt', 'desc'), limit(pageSize));

    const [snapshot, countSnap] = await Promise.all([
        getDocs(q),
        getCountFromServer(col),
    ]);

    const posts = snapshot.docs.map(docToPost);
    const lastDoc = snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1]
        : null;

    return {
        posts,
        lastDoc,
        totalCount: countSnap.data().count,
    };
}
