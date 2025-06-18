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
    <motion.div 
      className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-8 rounded-3xl shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Search Bar */}
      <div className="relative mb-8">
        <motion.div 
          className="flex items-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl px-6 py-4 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.01, y: -1 }}
        >
          <FaSearch className="text-purple-500 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Search amazing resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none w-full text-lg font-medium"
          />
          {searchTerm && (
            <motion.button
              onClick={() => setSearchTerm('')}
              className="ml-3 text-gray-400 hover:text-purple-600 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Enhanced Category Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          {categories.map((category, index) => {
            const gradients = [
              'from-purple-500 to-blue-500',
              'from-pink-500 to-rose-500', 
              'from-orange-500 to-red-500',
              'from-green-500 to-teal-500',
              'from-indigo-500 to-purple-500',
              'from-cyan-500 to-blue-500'
            ];
            const gradientClass = gradients[index % gradients.length];
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`px-6 py-3 rounded-2xl flex items-center font-bold text-lg transition-all duration-300 border-2 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-xl border-transparent transform hover:scale-105`
                    : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white hover:border-purple-300 hover:text-purple-600 shadow-lg hover:shadow-xl"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon && (
                  <motion.span 
                    className="mr-2"
                    animate={activeCategory === category.id ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {getIcon(category.icon)}
                  </motion.span>
                )}
                {category.name}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || activeCategory !== 'all') && (
        <motion.div 
          className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-bold">Active filters:</span>
              {searchTerm && (
                <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  "{searchTerm}"
                </span>
              )}
              {activeCategory !== 'all' && (
                <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(cat => cat.id === activeCategory)?.name}
                </span>
              )}
            </div>
            <motion.button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm underline transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Clear all
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Enhanced Items Per Page Selector */}
      <div className="flex justify-end">
        <motion.div 
          className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 rounded-2xl border-2 border-gray-200 shadow-lg"
          whileHover={{ scale: 1.02, y: -1 }}
        >
          <span className="mr-4 text-gray-700 font-bold text-lg flex items-center gap-2">
            <span className="text-xl">📄</span>
            Items per page:
          </span>
          <motion.select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-white border-2 border-purple-200 rounded-xl px-4 py-2 text-gray-800 font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 shadow-sm"
            whileFocus={{ scale: 1.02 }}
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </motion.select>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResourceFilters;
