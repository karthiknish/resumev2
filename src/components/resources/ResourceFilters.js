import React from "react";
import {
  FaBook,
  FaTools,
  FaVideo,
  FaCode,
  FaSearch,
  FaFlag,
  FaUsers,
} from "react-icons/fa";
import { categories } from "@/data/resources";

const ResourceFilters = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  itemsPerPage,
  setItemsPerPage,
}) => {
  // Icon mapping for categories
  const getIcon = (iconName) => {
    switch (iconName) {
      case "FaTools":
        return <FaTools />;
      case "FaBook":
        return <FaBook />;
      case "FaVideo":
        return <FaVideo />;
      case "FaCode":
        return <FaCode />;
      case "FaFlag":
        return <FaFlag />;
      case "FaUsers":
        return <FaUsers />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center bg-gray-900 rounded-lg px-4 py-2 w-full md:w-auto">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center transition-colors ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.icon && (
                <span className="mr-2">{getIcon(category.icon)}</span>
              )}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center text-gray-300 text-sm">
          <span className="mr-2">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilters;
