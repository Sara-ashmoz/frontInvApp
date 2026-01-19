'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-purple-50/30">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
              <p className="text-foreground/70 text-lg">
                Welcome to Invoice Parser — your elegant document management hub
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-muted/40 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <CardDescription className="text-foreground/60 font-medium">Total Invoices</CardDescription>
                  <CardTitle className="text-5xl font-bold text-primary">-</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/60">
                    Search by vendor to discover invoices
                  </p>
                </CardContent>
              </Card>

              <Card className="border-muted/40 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <CardDescription className="text-foreground/60 font-medium">Recent Uploads</CardDescription>
                  <CardTitle className="text-5xl font-bold text-secondary">-</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/60">
                    Start uploading to get going
                  </p>
                </CardContent>
              </Card>

              <Card className="border-muted/40 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <CardDescription className="text-foreground/60 font-medium">Processing Status</CardDescription>
                  <CardTitle className="text-5xl font-bold text-accent">Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/60">
                    System is prepared for action
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-muted/40">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Quick Actions</CardTitle>
                <CardDescription>
                  Start with these common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Link href="/upload">
                  <Button className="w-full h-28 text-base rounded-xl hover:scale-105 transition-transform" size="lg">
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="w-8 h-8"
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
                      <span>Upload Invoice</span>
                    </div>
                  </Button>
                </Link>

                <Link href="/invoices">
                  <Button
                    variant="outline"
                    className="w-full h-28 text-base rounded-xl border-muted/40 hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Search Invoices</span>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="border-muted/40">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Getting Started</CardTitle>
                <CardDescription>
                  Learn how to use Invoice Parser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/upload">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-muted/40">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400 text-white text-sm font-bold group-hover:shadow-md transition-all">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Upload an Invoice</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Upload PDF or image files containing invoice data. The system will automatically extract key information.
                      </p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/invoices">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-muted/40">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-emerald-400 text-white text-sm font-bold group-hover:shadow-md transition-all">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">Search by Vendor</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Use the Invoices page to search for invoices by vendor name and view detailed information.
                      </p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/invoices">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-muted/40">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-lavender-400 text-foreground text-sm font-bold group-hover:shadow-md transition-all">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">Review and Edit</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Click on any invoice to view details and make necessary edits to the extracted data.
                      </p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
