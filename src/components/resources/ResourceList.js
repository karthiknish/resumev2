import React from "react";
import ResourceCard from "./ResourceCard";

const ResourceList = ({ resources, clearFilters }) => {
  if (resources.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-300 mb-4">
          No resources found matching your search criteria.
        </p>
        <button
          onClick={clearFilters}
          className="text-blue-400 hover:text-blue-300"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
