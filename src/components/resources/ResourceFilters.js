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
import { motion } from "framer-motion";
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
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg shadow-xl border border-blue-500/20">
      <div className="flex items-center bg-black bg-opacity-50 rounded-lg px-4 py-3 w-full md:w-auto border border-blue-500/10 mb-6">
        <FaSearch className="text-blue-400 mr-2" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-white focus:outline-none w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`px-4 py-2 rounded-full flex items-center transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 transform hover:scale-[1.02]"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-300"
              }`}
            >
              {category.icon && (
                <span className="mr-2">{getIcon(category.icon)}</span>
              )}
              {category.name}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center text-gray-300 text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg border border-blue-500/10">
          <span className="mr-3 text-blue-400 font-medium">
            Items per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-white focus:outline-none focus:border-blue-500"
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
