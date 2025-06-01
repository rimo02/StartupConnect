"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Startup } from "@/lib/types/index";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useInfiniteScroll(
  collectionName: `startups`,
  filters: { industry?: string; fundingStage?: string },
  pageSize = 12
) {
  const [postList, setPostList] = useState<Startup[]>([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadPosts = useCallback(async (isNewSearch = false) => {
    if (loading || (!hasMore && !isNewSearch)) return;
    setLoading(true);
    
    try {
      const constraints = [];

      // Add filters only if they exist and aren't "all"
      if (filters.industry && filters.industry !== "all") {
        constraints.push(where("industry", "==", filters.industry));
      }

      if (filters.fundingStage && filters.fundingStage !== "all") {
        constraints.push(where("fundingStage", "==", filters.fundingStage));
      }

      let q = query(
        collection(db, collectionName),
        limit(pageSize),
        ...constraints
      );

      // Only add startAfter if it's not a new search and we have a lastVisible
      if (!isNewSearch && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapShot = await getDocs(q);
      const data = snapShot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Startup)
      );

      if (snapShot.empty || data.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isNewSearch) {
        setPostList(data);
      } else {
        setPostList((prev) => [...prev, ...data]);
      }
      
      setLastVisible(snapShot.docs[snapShot.docs.length - 1] || null);
    } catch (error) {
      console.error("Failed to load Posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastVisible, pageSize, collectionName, filters.industry, filters.fundingStage]);

  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts(false);
        }
      });

      if (node && hasMore) observerRef.current.observe(node);
    },
    [loading, hasMore, loadPosts]
  );

  // Load initial posts and handle filter changes
  useEffect(() => {
    // Reset state for new search
    setPostList([]);
    setLastVisible(null);
    setHasMore(true);
    
    // Load posts with new filters
    loadPosts(true);
  }, [filters.industry, filters.fundingStage, collectionName, pageSize]);

  return {
    postList,
    loading,
    hasMore,
    lastPostRef,
  };
}