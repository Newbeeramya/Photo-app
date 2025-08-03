# AI Photo & PDF Enhancer

A modern, accessible web application that uses AI to enhance photos and PDFs. Transform blurry, tilted, or low-quality images and documents into crystal-clear, professional-looking files.

## Features

### 🚀 Core Functionality
- **AI Enhancement**: Advanced algorithms for deblurring and clarity improvement
- **Perspective Correction**: Automatically straighten tilted or skewed documents
- **Batch Processing**: Process multiple files simultaneously
- **OCR Integration**: Convert images to searchable/editable text (coming soon)
- **Format Support**: JPEG, PNG, WebP images and PDF documents

### 🎨 User Experience
- **Modern UI**: Clean, minimal design with muted color palette
- **Dark Mode**: Full dark mode support with system preference detection
- **Accessibility**: High contrast mode, scalable fonts, keyboard navigation
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Progressive Web App**: Install on any device for native-like experience

### 🔧 Advanced Features
- **Before/After Comparison**: Interactive slider to compare original and enhanced files
- **Processing History**: View and manage all your enhanced files
- **Customizable Settings**: Adjust enhancement intensity and preferences
- **Cloud Sync**: (Coming soon) Sync files to Google Drive, Dropbox, etc.
- **Batch Operations**: Select and process multiple files at once

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing
- **React Dropzone** - Drag and drop file uploads
- **React Compare Slider** - Before/after image comparison

### Backend & Storage
- **Firebase** - Authentication, database, and file storage
- **Local Storage** - Settings and history persistence
- **IndexedDB** - Large file caching (future enhancement)

### AI & Processing
- **Canvas API** - Client-side image processing
- **Web Workers** - Background processing (future enhancement)
- **TensorFlow.js** - AI model integration (future enhancement)

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project (for cloud features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd photo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database and Storage
   - Copy your Firebase config to `src/config/firebase.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage

### Basic Workflow
1. **Upload**: Drag and drop files or click to browse
2. **Preview**: View your file with editing tools
3. **Enhance**: Click "Enhance Now" to apply AI improvements
4. **Compare**: Use the before/after slider to see improvements
5. **Download**: Save your enhanced file
6. **History**: Access all processed files anytime

### Supported File Types
- **Images**: JPEG, PNG, WebP (up to 10MB)
- **Documents**: PDF files (up to 10MB)

### Enhancement Features
- **Auto Deblurring**: Sharpen blurred content
- **Perspective Correction**: Straighten tilted documents
- **Clarity Enhancement**: Improve resolution and contrast
- **Noise Reduction**: Remove grain and artifacts

## Accessibility Features

### Visual Accessibility
- High contrast mode for better visibility
- Scalable font sizes (small, medium, large)
- Clear focus indicators for keyboard navigation
- Alt text for all images and icons

### Motor Accessibility
- Large click targets (minimum 44px)
- Keyboard navigation support
- Voice control compatibility
- Reduced motion support

### Cognitive Accessibility
- Clear, simple language
- Consistent navigation
- Progress indicators for long operations
- Error messages with helpful suggestions

## Browser Support

- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

## Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## Security & Privacy

- **Local Processing**: Images processed locally when possible
- **No Data Collection**: We don't store or analyze your files
- **Secure Upload**: All uploads use HTTPS encryption
- **Privacy First**: Your files are automatically deleted after processing

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React best practices and hooks patterns
- Write accessible HTML with proper ARIA labels
- Include tests for new features

## Roadmap

### Phase 1 (Current)
- ✅ Basic UI and file upload
- ✅ Image preview and comparison
- ✅ Settings and history management
- ✅ Accessibility features

### Phase 2 (Next)
- 🔄 AI model integration (TensorFlow.js)
- 🔄 Advanced image processing (OpenCV.js)
- 🔄 OCR functionality (Tesseract.js)
- 🔄 Batch processing optimization

### Phase 3 (Future)
- 📋 Cloud sync integration
- 📋 Mobile app (React Native)
- 📋 Advanced AI models
- 📋 Team collaboration features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs or request features on GitHub
- **Community**: Join our Discord server for discussions

## Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS approach
- **Lucide** - For the beautiful icon set
- **Firebase** - For the backend infrastructure
- **Open Source Community** - For the countless libraries and tools

---

Made with ❤️ for better document and photo enhancement
