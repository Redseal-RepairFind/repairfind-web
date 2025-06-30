"use client";

import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Available options for items per page
const perPageOptions = [5, 10, 15, 25, 35, 45];

type dData = {
  data: { lastPage: number; data: any }; // Ensure lastPage is of type number
};

const Pagination = ({ data }: dData) => {
  const [currentPageNo, setCurrentPageNo] = useState<number>(1); // Active page
  const [perPage, setPerPage] = useState<number>(10); // Items per page

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // console.log(data);
  // Sync pageNo and perPage with URL query params on component mount
  useEffect(() => {
    const currentPageFromURL = searchParams.get("page");
    const perPageFromURL = searchParams.get("perPage");

    if (currentPageFromURL) {
      setCurrentPageNo(parseInt(currentPageFromURL) || 1); // Default to 1 if NaN
    }
    if (perPageFromURL) {
      setPerPage(parseInt(perPageFromURL) || 10); // Default to 10 if NaN
    }
  }, [searchParams]);

  // Update URL with pagination information
  const updateUrlParams = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", newPage.toString());
    params.set("perPage", newPerPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle changing per page value
  const handlePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setCurrentPageNo(1); // Reset to first page on per page change
    setPerPage(newPerPage);
    updateUrlParams(1, newPerPage);
  };

  const totalPages = data?.lastPage || 1; // Default to 1 if lastPage is undefined or NaN

  // Generate visible pages with ellipses
  const getVisiblePages = () => {
    let pages: (number | string)[] = [];

    // Case 1: If total pages are 15 or less, display all pages
    if (totalPages <= 15) {
      pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      // Case 2: More than 15 pages, dynamic page range
      if (currentPageNo <= 7) {
        // Display the first 15 pages
        pages = Array.from({ length: 15 }, (_, index) => index + 1);
        pages.push("...", totalPages); // Add ellipsis and last page
      } else if (currentPageNo >= totalPages - 7) {
        // Near the end: show last 15 pages
        pages.push(1, "..."); // Include first page and ellipsis
        pages = pages.concat(
          Array.from({ length: 15 }, (_, index) => totalPages - 14 + index)
        );
      } else {
        // Middle range: show current page and 7 pages before/after it
        pages.push(1, "..."); // Include first page and ellipsis
        pages = pages.concat(
          Array.from({ length: 15 }, (_, index) => currentPageNo - 7 + index)
        );
        pages.push("...", totalPages); // Include ellipsis and last page
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="w-full flex items-center gap-4 justify-between">
      <div className="flex items-center justify-center gap-4">
        {/* BACK BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            currentPageNo > 1 ? "text-primary" : "text-gray-500"
          }`}
          disabled={currentPageNo === 1}
          onClick={() => {
            const newPageNo = currentPageNo - 1;
            setCurrentPageNo(newPageNo);
            updateUrlParams(newPageNo, perPage);
          }}
          aria-label="Previous Page"
        >
          <FaCaretLeft className="w-3" />
        </button>

        {/* PAGINATION BUTTONS */}
        {visiblePages?.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="text-sm font-medium text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              className={
                page === currentPageNo
                  ? "text-sm font-medium text-white bg-black p-1 rounded-sm"
                  : "text-sm font-medium text-primary"
              }
              key={`page-${page}`} // Ensure keys are unique
              onClick={() => {
                setCurrentPageNo(page as number); // Type assertion since page can be string
                updateUrlParams(page as number, perPage);
              }}
              aria-current={page === currentPageNo ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          )
        )}

        {/* FORWARD BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            currentPageNo < totalPages ? "text-primary" : "text-gray-500"
          }`}
          disabled={currentPageNo === totalPages}
          onClick={() => {
            const newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo);
            updateUrlParams(newPageNo, perPage);
          }}
          aria-label="Next Page"
        >
          <FaCaretRight className="w-3" />
        </button>
      </div>

      {/* PER PAGE SELECTOR */}
      <select
        value={perPage}
        className="text-xs font-medium border border-gray-400 rounded-sm py-2 px-4 focus:ring-0 duration-200 outline-none"
        onChange={handlePerPage}
        aria-label="Items per page"
      >
        {perPageOptions.map((perPageOption) => (
          <option key={`perPage-${perPageOption}`} value={perPageOption}>
            {perPageOption} Per Page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
