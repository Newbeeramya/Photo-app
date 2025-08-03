import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Calendar,
  FileImage,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function HistoryScreen() {
  const { state, actions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, images, pdfs
  const [selectedItems, setSelectedItems] = useState(new Set());

  const filteredHistory = state.processingHistory.filter(item => {
    const matchesSearch = item.originalFile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'images' && item.originalFile.type.startsWith('image/')) ||
      (filterType === 'pdfs' && item.originalFile.type === 'application/pdf');
    
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (file, filename) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async (file) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Enhanced File',
          files: [file]
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item from history?')) {
      actions.removeFromHistory(id);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleBatchDelete = () => {
    if (selectedItems.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} selected items?`)) {
      selectedItems.forEach(id => actions.removeFromHistory(id));
      setSelectedItems(new Set());
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFileIcon = (fileType) => {
    return fileType.startsWith('image/') ? FileImage : FileText;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Processing History
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your enhanced files
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Search files"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Filter by file type"
          >
            <option value="all">All Files</option>
            <option value="images">Images Only</option>
            <option value="pdfs">PDFs Only</option>
          </select>
        </div>

        {selectedItems.size > 0 && (
          <button
            onClick={handleBatchDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus-visible"
            aria-label={`Delete ${selectedItems.size} selected items`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedItems.size})</span>
          </button>
        )}
      </div>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FileImage className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterType !== 'all' ? 'No matching files found' : 'No files processed yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by uploading and enhancing your first photo or PDF'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const FileIcon = getFileIcon(item.originalFile.type);
            const isSelected = selectedItems.has(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Checkbox */}
                <div className="p-4 pb-0">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Select</span>
                  </label>
                </div>

                {/* File Preview */}
                <div className="p-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {item.originalFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(item.enhancedFile || item.originalFile)}
                        alt={`Preview of ${item.originalFile.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate" title={item.originalFile.name}>
                      {item.originalFile.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.timestamp)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <FileIcon className="w-4 h-4" />
                      <span>{item.originalFile.type.split('/')[1].toUpperCase()}</span>
                      <span>•</span>
                      <span>{(item.originalFile.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        // Preview functionality could be implemented here
                        console.log('Preview:', item);
                      }}
                      className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label={`Preview ${item.originalFile.name}`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(
                          item.enhancedFile || item.originalFile, 
                          item.enhancedFile ? `enhanced_${item.originalFile.name}` : item.originalFile.name
                        )}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        aria-label={`Download ${item.originalFile.name}`}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleShare(item.enhancedFile || item.originalFile)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        aria-label={`Share ${item.originalFile.name}`}
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label={`Delete ${item.originalFile.name}`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {state.processingHistory.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Total Files:</span>
              <span>{state.processingHistory.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Images:</span>
              <span>{state.processingHistory.filter(item => item.originalFile.type.startsWith('image/')).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">PDFs:</span>
              <span>{state.processingHistory.filter(item => item.originalFile.type === 'application/pdf').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryScreen;
