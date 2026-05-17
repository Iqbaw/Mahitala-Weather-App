import React from 'react';

const PaginationDicari = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex justify-center items-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === index + 1
                  ? "bg-[#6C7D41] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
    );
}

export default PaginationDicari;