import React, { useEffect, useRef, useState } from "react";

const InfiniteScrollWrapper = ({
    items,
    batchSize = 10,
    renderItem,
    loader = "Loading more...",
}) => {
    const [visible, setVisible] = useState([]);
    const loaderRef = useRef(null);

    // Load first batch
    useEffect(() => {
        setVisible(items.slice(0, batchSize));
    }, [items, batchSize]);

    // Intersection Observer
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [visible]);

    const loadMore = () => {
        const nextCount = visible.length + batchSize;
        const nextBatch = items.slice(0, nextCount);

        if (nextBatch.length > visible.length) {
            setVisible(nextBatch);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {visible.map((item, i) => (
                <div key={item._id || i}>{renderItem(item, i)}</div>
            ))}

            <div ref={loaderRef} className="py-4 text-center opacity-60">
                {loader}
            </div>
        </div>
    );
};

export default InfiniteScrollWrapper;
