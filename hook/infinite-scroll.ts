"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Startup } from "@/lib/types/index";
import {
  collection,
  getDocs,
  limit,
  query,
  QueryConstraint,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useInfiniteScroll(
  collectionName: `startups`,
  filters: { industry?: string; fundingStage?: string; search?: string },
  pageSize = 12
) {
  const [postList, setPostList] = useState<Startup[]>([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadPosts = useCallback(
    async (isNewSearch = false) => {
      if (loading || (!hasMore && !isNewSearch)) return;
      setLoading(true);

      try {
        const constraints: QueryConstraint[] = [];

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

        if (!isNewSearch && lastVisible) {
          q = query(q, startAfter(lastVisible));
        }

        const snapShot = await getDocs(q);
        const data = snapShot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Startup)
        );

        let filteredData = data;
        if (filters.search) {
          const keyword = filters.search.toLowerCase();
          filteredData = data.filter(
            (startup) =>
              startup.name.toLowerCase().includes(keyword) ||
              startup.description.toLowerCase().includes(keyword)
          );
        }

        if (snapShot.empty || filteredData.length < pageSize) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (isNewSearch) {
          setPostList(filteredData);
        } else {
          setPostList((prev) => [...prev, ...filteredData]);
        }

        setLastVisible(snapShot.docs[snapShot.docs.length - 1] || null);
      } catch (error) {
        console.error("Failed to load Posts:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      hasMore,
      lastVisible,
      pageSize,
      collectionName,
      filters.industry,
      filters.fundingStage,
      filters.search,
    ]
  );

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

  useEffect(() => {
    setPostList([]);
    setLastVisible(null);
    setHasMore(true);
    loadPosts(true);
  }, [filters.industry, filters.fundingStage, filters.search]);

  return {
    postList,
    loading,
    hasMore,
    lastPostRef,
  };
}
