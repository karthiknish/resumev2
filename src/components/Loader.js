import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
