// Image processing utilities for perspective correction and document detection
import cv from 'opencv.js';

class ImageProcessor {
  constructor() {
    this.isOpenCVReady = false;
    this.initOpenCV();
  }

  async initOpenCV() {
    return new Promise((resolve) => {
      if (typeof cv !== 'undefined' && cv.Mat) {
        this.isOpenCVReady = true;
        resolve();
        return;
      }

      // Wait for OpenCV to load
      const checkOpenCV = () => {
        if (typeof cv !== 'undefined' && cv.Mat) {
          this.isOpenCVReady = true;
          resolve();
        } else {
          setTimeout(checkOpenCV, 100);
        }
      };
      checkOpenCV();
    });
  }

  // Convert image file to OpenCV Mat
  async fileToMat(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const mat = cv.matFromImageData(imageData);
        resolve(mat);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Convert OpenCV Mat to canvas
  matToCanvas(mat, canvasId) {
    cv.imshow(canvasId, mat);
  }

  // Detect document edges using contour detection
  detectDocumentEdges(src) {
    const gray = new cv.Mat();
    const blur = new cv.Mat();
    const edges = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    try {
      // Convert to grayscale
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      
      // Apply Gaussian blur to reduce noise
      cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
      
      // Edge detection using Canny
      cv.Canny(blur, edges, 50, 150);
      
      // Find contours
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      
      let maxArea = 0;
      let bestContour = null;
      
      // Find the largest rectangular contour
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        
        if (area > maxArea && area > src.rows * src.cols * 0.1) {
          // Approximate contour to polygon
          const epsilon = 0.02 * cv.arcLength(contour, true);
          const approx = new cv.Mat();
          cv.approxPolyDP(contour, approx, epsilon, true);
          
          // Check if it's roughly rectangular (4 corners)
          if (approx.rows === 4) {
            maxArea = area;
            if (bestContour) bestContour.delete();
            bestContour = approx.clone();
          }
          approx.delete();
        }
        contour.delete();
      }
      
      // Clean up
      gray.delete();
      blur.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
      
      return bestContour;
    } catch (error) {
      console.error('Error in document edge detection:', error);
      // Clean up on error
      [gray, blur, edges, contours, hierarchy].forEach(mat => {
        try { mat.delete(); } catch (e) {}
      });
      return null;
    }
  }

  // Extract corner points from contour
  getCornerPoints(contour) {
    if (!contour || contour.rows !== 4) return null;

    const points = [];
    for (let i = 0; i < 4; i++) {
      const point = contour.data32S.slice(i * 2, i * 2 + 2);
      points.push({ x: point[0], y: point[1] });
    }

    // Sort points: top-left, top-right, bottom-right, bottom-left
    points.sort((a, b) => a.y - b.y);
    
    const top = points.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottom = points.slice(2, 4).sort((a, b) => a.x - b.x);
    
    return {
      topLeft: top[0],
      topRight: top[1],
      bottomLeft: bottom[0],
      bottomRight: bottom[1]
    };
  }

  // Apply perspective transformation
  correctPerspective(src, corners, outputWidth = 800, outputHeight = 1000) {
    if (!corners) return src.clone();

    const { topLeft, topRight, bottomLeft, bottomRight } = corners;
    
    // Source points (detected corners)
    const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
      topLeft.x, topLeft.y,
      topRight.x, topRight.y,
      bottomRight.x, bottomRight.y,
      bottomLeft.x, bottomLeft.y
    ]);
    
    // Destination points (rectangle)
    const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      outputWidth, 0,
      outputWidth, outputHeight,
      0, outputHeight
    ]);
    
    // Get perspective transform matrix
    const transformMatrix = cv.getPerspectiveTransform(srcPoints, dstPoints);
    
    // Apply transformation
    const corrected = new cv.Mat();
    cv.warpPerspective(src, corrected, transformMatrix, new cv.Size(outputWidth, outputHeight));
    
    // Clean up
    srcPoints.delete();
    dstPoints.delete();
    transformMatrix.delete();
    
    return corrected;
  }

  // Auto-rotate image based on text orientation
  autoRotate(src) {
    const rotations = [0, 90, 180, 270];
    let bestRotation = 0;
    let bestScore = 0;

    for (const angle of rotations) {
      const rotated = this.rotateImage(src, angle);
      const score = this.calculateTextOrientationScore(rotated);
      
      if (score > bestScore) {
        bestScore = score;
        bestRotation = angle;
      }
      
      if (angle !== 0) rotated.delete();
    }

    if (bestRotation === 0) {
      return src.clone();
    } else {
      return this.rotateImage(src, bestRotation);
    }
  }

  // Rotate image by specified angle
  rotateImage(src, angle) {
    if (angle === 0) return src.clone();

    const center = new cv.Point2f(src.cols / 2, src.rows / 2);
    const rotationMatrix = cv.getRotationMatrix2D(center, angle, 1.0);
    
    const rotated = new cv.Mat();
    const size = angle % 180 === 0 
      ? new cv.Size(src.cols, src.rows)
      : new cv.Size(src.rows, src.cols);
    
    cv.warpAffine(src, rotated, rotationMatrix, size);
    
    rotationMatrix.delete();
    return rotated;
  }

  // Calculate text orientation score (simplified heuristic)
  calculateTextOrientationScore(src) {
    const gray = new cv.Mat();
    const edges = new cv.Mat();
    
    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.Canny(gray, edges, 50, 150);
      
      // Count horizontal vs vertical edges
      const horizontalKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(25, 1));
      const verticalKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, 25));
      
      const horizontal = new cv.Mat();
      const vertical = new cv.Mat();
      
      cv.morphologyEx(edges, horizontal, cv.MORPH_OPEN, horizontalKernel);
      cv.morphologyEx(edges, vertical, cv.MORPH_OPEN, verticalKernel);
      
      const horizontalSum = cv.sumElems(horizontal)[0];
      const verticalSum = cv.sumElems(vertical)[0];
      
      // Clean up
      gray.delete();
      edges.delete();
      horizontalKernel.delete();
      verticalKernel.delete();
      horizontal.delete();
      vertical.delete();
      
      // Return ratio favoring horizontal lines (typical for text)
      return horizontalSum / (verticalSum + 1);
    } catch (error) {
      console.error('Error calculating text orientation score:', error);
      [gray, edges].forEach(mat => {
        try { mat.delete(); } catch (e) {}
      });
      return 0;
    }
  }

  // Enhance image quality (contrast, brightness, sharpening)
  enhanceQuality(src, intensity = 'medium') {
    const enhanced = src.clone();
    
    try {
      // Adjust contrast and brightness based on intensity
      const alpha = intensity === 'low' ? 1.1 : intensity === 'high' ? 1.4 : 1.25;
      const beta = intensity === 'low' ? 5 : intensity === 'high' ? 15 : 10;
      
      enhanced.convertTo(enhanced, -1, alpha, beta);
      
      // Apply sharpening filter
      const kernel = cv.matFromArray(3, 3, cv.CV_32FC1, [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
      ]);
      
      const sharpened = new cv.Mat();
      cv.filter2D(enhanced, sharpened, -1, kernel);
      
      kernel.delete();
      enhanced.delete();
      
      return sharpened;
    } catch (error) {
      console.error('Error enhancing image quality:', error);
      return enhanced;
    }
  }

  // Remove noise from image
  removeNoise(src) {
    const denoised = new cv.Mat();
    
    try {
      // Apply bilateral filter to reduce noise while preserving edges
      cv.bilateralFilter(src, denoised, 9, 75, 75);
      return denoised;
    } catch (error) {
      console.error('Error removing noise:', error);
      denoised.delete();
      return src.clone();
    }
  }

  // Main processing function
  async processDocument(file, options = {}) {
    const {
      autoCorrectPerspective = true,
      autoRotate = true,
      enhanceQuality = true,
      removeNoise = true,
      intensity = 'medium'
    } = options;

    if (!this.isOpenCVReady) {
      await this.initOpenCV();
    }

    try {
      // Load image
      const src = await this.fileToMat(file);
      let processed = src.clone();

      // Step 1: Auto-rotate if enabled
      if (autoRotate) {
        const rotated = this.autoRotate(processed);
        processed.delete();
        processed = rotated;
      }

      // Step 2: Perspective correction if enabled
      if (autoCorrectPerspective) {
        const contour = this.detectDocumentEdges(processed);
        if (contour) {
          const corners = this.getCornerPoints(contour);
          if (corners) {
            const corrected = this.correctPerspective(processed, corners);
            processed.delete();
            processed = corrected;
          }
          contour.delete();
        }
      }

      // Step 3: Remove noise if enabled
      if (removeNoise) {
        const denoised = this.removeNoise(processed);
        processed.delete();
        processed = denoised;
      }

      // Step 4: Enhance quality if enabled
      if (enhanceQuality) {
        const enhanced = this.enhanceQuality(processed, intensity);
        processed.delete();
        processed = enhanced;
      }

      // Convert back to canvas/blob
      const canvas = document.createElement('canvas');
      canvas.width = processed.cols;
      canvas.height = processed.rows;
      cv.imshow(canvas, processed);

      // Clean up
      src.delete();
      processed.delete();

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const enhancedFile = new File([blob], `enhanced_${file.name}`, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(enhancedFile);
        }, file.type, 0.95);
      });

    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document: ' + error.message);
    }
  }
}

// Export singleton instance
export default new ImageProcessor();
