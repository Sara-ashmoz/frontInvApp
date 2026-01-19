'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];

  const validateFile = (file: File): boolean => {
    console.log('Validating file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    // Check file extension as fallback for PDF
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = allowedTypes.includes(file.type);
    
    if (!isPDF && !isImage) {
      toast.error('Invalid file type. Please upload PDF files only (backend restriction).');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error('File size exceeds 10MB limit.');
      return false;
    }
    
    if (!isPDF) {
      toast.warning('Note: Backend only accepts PDF files. Image upload may fail.');
    }
    
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
    setIsUploading(true);

    try {
      const response = await ApiClient.extractInvoice(file);
      console.log('Upload successful, invoice ID:', response.invoiceId);
      toast.success('Invoice extracted successfully!');
      
      // Navigate to the invoice details page
      setTimeout(() => {
        router.push(`/invoice/${response.invoiceId}`);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload invoice';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50/30">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-primary">Upload Invoice</h1>
              <p className="text-foreground/70 text-lg">
                Upload PDF or image files for intelligent invoice extraction
              </p>
            </div>

            {/* Upload Card */}
            <Card className="border-muted/40">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Select File</CardTitle>
                <CardDescription>
                  Drag and drop or click to select an invoice file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 scale-105'
                      : 'border-muted/40 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/3 hover:to-secondary/3'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <svg
                        className="w-12 h-12 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {file ? file.name : 'Drop your file here or click to browse'}
                    </p>
                    <p className="text-sm text-foreground/60">
                      Supported: PDF, JPG, PNG, GIF (max 10MB)
                    </p>
                  </div>
                </div>

                {/* File Info */}
                {file && (
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-muted/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{file.name}</p>
                          <p className="text-sm text-foreground/60">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="flex-1"
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Upload & Extract'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!file || isUploading}
                    size="lg"
                    className="border-muted/40"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-muted/40">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border border-muted/20 hover:border-primary/30 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400 text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Select a Clear Invoice
                    </p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Choose a clear, readable invoice document in PDF or image format
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border border-muted/20 hover:border-secondary/30 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-emerald-400 text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Upload & Process
                    </p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Click "Upload & Extract" to send the file to our intelligent processing backend
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border border-muted/20 hover:border-accent/30 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-lavender-400 text-foreground text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Review & Refine
                    </p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Review the extracted invoice data and make any necessary refinements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
