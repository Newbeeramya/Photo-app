import React, { useState } from 'react';
import { 
  FileImage,
  Search,
  Filter
} from 'lucide-react';

function HistoryScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Processing History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your processed photos and documents.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
          >
            <option value="all">All Files</option>
            <option value="images">Images</option>
            <option value="pdfs">PDFs</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No processed files yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upload and process some photos to see them here.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Upload Photos
        </button>
      </div>
    </div>
  );
}

export default HistoryScreen;
