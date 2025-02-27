import React from "react";
import Link from "next/link";

const SuggestionBox = () => {
  return (
    <div className="bg-blue-900/30 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Suggest a Resource</h2>
      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
        Know a great resource that should be included here? I'm always looking
        to expand this collection with high-quality content.
      </p>
      <Link
        href="/contact"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
      >
        Suggest Resource
      </Link>
    </div>
  );
};

export default SuggestionBox;
