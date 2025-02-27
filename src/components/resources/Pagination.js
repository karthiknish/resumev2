import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  filteredResourcesLength,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-1 px-3 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>

          {/* Page numbers */}
          <div className="flex">
            {/* First page */}
            {currentPage > 2 && (
              <button
                onClick={() => paginate(1)}
                className="mx-1 px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700"
              >
                1
              </button>
            )}

            {/* Ellipsis for large gaps */}
            {currentPage > 3 && (
              <span className="mx-1 px-3 py-1 text-gray-500">...</span>
            )}

            {/* Previous page (if not first) */}
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="mx-1 px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700"
              >
                {currentPage - 1}
              </button>
            )}

            {/* Current page */}
            <button
              onClick={() => paginate(currentPage)}
              className="mx-1 px-3 py-1 rounded-md bg-blue-600 text-white"
            >
              {currentPage}
            </button>

            {/* Next page (if not last) */}
            {currentPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="mx-1 px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700"
              >
                {currentPage + 1}
              </button>
            )}

            {/* Ellipsis for large gaps */}
            {currentPage < totalPages - 2 && (
              <span className="mx-1 px-3 py-1 text-gray-500">...</span>
            )}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => paginate(totalPages)}
                className="mx-1 px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700"
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-1 px-3 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Results summary */}
      <div className="text-center text-gray-400 mt-4">
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, filteredResourcesLength)} of{" "}
        {filteredResourcesLength} resources
      </div>
    </>
  );
};

export default Pagination;
