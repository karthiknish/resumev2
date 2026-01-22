// Converted to TypeScript - migrated
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

interface ResourceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  itemsPerPage,
  setItemsPerPage,
}) => {
  // Icon mapping for categories
  const getIcon = (iconName: string) => {
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
      className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Search Bar */}
      <div className="relative mb-8">
        <motion.div 
          className="flex items-center bg-slate-100 rounded-2xl px-5 sm:px-6 py-3.5 border border-slate-200 hover:border-slate-300 transition-all duration-200"
          whileHover={{ scale: 1.01, y: -1 }}
        >
          <FaSearch className="text-slate-500 mr-3 text-base sm:text-lg" />
          <input
            type="text"
            placeholder="Search amazing resources..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none w-full text-base sm:text-lg font-medium"
          />
          {searchTerm && (
            <motion.button
              onClick={() => setSearchTerm('')}
              className="ml-3 text-slate-400 hover:text-slate-700 transition-colors duration-200"
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
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`px-5 py-2.5 rounded-2xl flex items-center font-semibold text-sm sm:text-base transition-all duration-200 border ${
                  activeCategory === category.id
                    ? "bg-slate-900 text-slate-100 border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
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
          className="mb-6 p-4 bg-slate-100 rounded-2xl border border-slate-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold">Active filters:</span>
              {searchTerm && (
                <span className="bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                  "{searchTerm}"
                </span>
              )}
              {activeCategory !== 'all' && (
                <span className="bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
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
          className="flex items-center bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm"
          whileHover={{ scale: 1.02, y: -1 }}
        >
          <span className="mr-4 text-slate-600 font-semibold text-sm sm:text-base flex items-center gap-2">
            <span className="text-lg">📄</span>
            Items per page
          </span>
          <motion.select
            value={itemsPerPage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-semibold focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
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

