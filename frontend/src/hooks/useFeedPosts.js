import { useCallback, useMemo, useRef, useState } from 'react';
import { fetchFeed } from '../services/feed.api.js';
import { getUserProfileById } from '../services/user.api.js';

const normalizePostsResponse = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
};

const useFeedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ stage: 'all', post_type: 'startup_idea' });
  const authorCacheRef = useRef(new Map());

  const loadPosts = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);

    // Merge new filters with existing ones
    const updatedFilters = { ...filters, ...newFilters };

    // If we're just initializing or passed a string (backward compatibility/simple usage)
    if (typeof newFilters === 'string') {
      updatedFilters.stage = newFilters;
    } else {
      // If passing an object, update state
      setFilters(prev => ({ ...prev, ...newFilters }));
    }

    // Ensure we use the most up-to-date filters for the API call
    // Note: React state updates are async, so we use the calculated merged object
    const apiFilters = typeof newFilters === 'string'
      ? { ...filters, stage: newFilters }
      : { ...filters, ...newFilters };

    try {
      // clean filters for API
      const params = {};
      if (apiFilters.stage && apiFilters.stage !== 'all') params.stage = apiFilters.stage;
      if (apiFilters.post_type && apiFilters.post_type !== 'all') params.post_type = apiFilters.post_type;

      const feedResponse = await fetchFeed(params);
      const postsData = normalizePostsResponse(feedResponse);

      const authorIds = Array.from(new Set(postsData.map((post) => post.author_id).filter(Boolean)));

      const authorEntries = await Promise.all(
        authorIds.map(async (authorId) => {
          if (authorCacheRef.current.has(authorId)) {
            return [authorId, authorCacheRef.current.get(authorId)];
          }

          try {
            const profile = await getUserProfileById(authorId);
            authorCacheRef.current.set(authorId, profile);
            return [authorId, profile];
          } catch (profileError) {
            authorCacheRef.current.set(authorId, null);
            return [authorId, null];
          }
        }),
      );

      const authorMap = new Map(authorEntries);
      const postsWithAuthor = postsData.map((post) => ({
        ...post,
        authorProfile: authorMap.get(post.author_id) || null,
      }));

      setPosts(postsWithAuthor);
    } catch (fetchError) {
      setPosts([]);
      setError(fetchError.message || 'Unable to load feed');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const resetCache = useCallback(() => {
    authorCacheRef.current = new Map();
  }, []);

  const value = useMemo(
    () => ({
      posts,
      loading,
      error,
      filters,
      loadPosts,
      resetCache,
    }),
    [posts, loading, error, filters, loadPosts, resetCache],
  );

  return value;
};

export default useFeedPosts;
