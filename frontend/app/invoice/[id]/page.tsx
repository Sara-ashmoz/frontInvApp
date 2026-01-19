'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApiClient } from '@/lib/api';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.getInvoiceById(invoiceId);
      setInvoice(data);
      setEditedInvoice(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedInvoice(invoice);
    setIsEditing(false);
  };

  const handleSave = () => {
    // UI-only save - not submitted to backend
    setInvoice(editedInvoice);
    setIsEditing(false);
    toast.success('Changes saved (UI only - not submitted to backend)');
  };

  const handleInputChange = (field: keyof Invoice, value: any) => {
    if (editedInvoice) {
      setEditedInvoice({
        ...editedInvoice,
        [field]: value,
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50/30">
          <Navigation />
          <main className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 mx-auto text-primary"
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
                <p className="mt-4 text-foreground/70">Loading invoice...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!invoice || !editedInvoice) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50/30">
          <Navigation />
          <main className="container mx-auto px-4 py-12">
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-primary">Invoice Not Found</h2>
              <p className="mt-3 text-foreground/70 text-lg">
                The invoice you're looking for doesn't exist or couldn't be loaded.
              </p>
              <Button onClick={() => router.push('/invoices')} className="mt-6" size="lg">
                Back to Invoices
              </Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50/30">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/invoices')}
                  className="mb-3"
                >
                  ← Back to Invoices
                </Button>
                <h1 className="text-4xl font-bold text-primary">Invoice Details</h1>
                <p className="text-foreground/70 mt-2">
                  Invoice ID: <span className="font-semibold text-foreground">{invoice.invoiceId}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={handleEdit} size="lg">Edit Invoice</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <Card className="border-muted/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-primary">Basic Information</CardTitle>
                    <CardDescription>
                      Core invoice details and identification
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(editedInvoice.status)} border`}
                  >
                    {editedInvoice.status || 'Unknown'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber" className="font-medium">Invoice Number</Label>
                  {isEditing ? (
                    <Input
                      id="invoiceNumber"
                      value={editedInvoice.invoiceNumber || ''}
                      onChange={(e) =>
                        handleInputChange('invoiceNumber', e.target.value)
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {invoice.invoiceNumber || 'N/A'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorName" className="font-medium">Vendor Name</Label>
                  {isEditing ? (
                    <Input
                      id="vendorName"
                      value={editedInvoice.vendorName || ''}
                      onChange={(e) =>
                        handleInputChange('vendorName', e.target.value)
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-primary">{invoice.vendorName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDate" className="font-medium">Invoice Date</Label>
                  {isEditing ? (
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={formatDate(editedInvoice.invoiceDate)}
                      onChange={(e) =>
                        handleInputChange('invoiceDate', e.target.value)
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {formatDisplayDate(invoice.invoiceDate)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="font-medium">Due Date</Label>
                  {isEditing ? (
                    <Input
                      id="dueDate"
                      type="date"
                      value={formatDate(editedInvoice.dueDate)}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {formatDisplayDate(invoice.dueDate)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="font-medium">Status</Label>
                  {isEditing ? (
                    <Input
                      id="status"
                      value={editedInvoice.status || ''}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">{invoice.status || 'N/A'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="font-medium">Currency</Label>
                  {isEditing ? (
                    <Input
                      id="currency"
                      value={editedInvoice.currency || 'USD'}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">{invoice.currency || 'USD'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card className="border-muted/40">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Financial Details</CardTitle>
                <CardDescription>Amount breakdown and totals</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subtotal" className="font-medium">Subtotal</Label>
                  {isEditing ? (
                    <Input
                      id="subtotal"
                      type="number"
                      step="0.01"
                      value={editedInvoice.subtotal || ''}
                      onChange={(e) =>
                        handleInputChange('subtotal', parseFloat(e.target.value))
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {invoice.subtotal
                        ? formatCurrency(invoice.subtotal, invoice.currency)
                        : 'N/A'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxAmount" className="font-medium">Tax Amount</Label>
                  {isEditing ? (
                    <Input
                      id="taxAmount"
                      type="number"
                      step="0.01"
                      value={editedInvoice.taxAmount || ''}
                      onChange={(e) =>
                        handleInputChange('taxAmount', parseFloat(e.target.value))
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {invoice.taxAmount
                        ? formatCurrency(invoice.taxAmount, invoice.currency)
                        : 'N/A'}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="totalAmount" className="font-medium">Total Amount</Label>
                  {isEditing ? (
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      value={editedInvoice.totalAmount}
                      onChange={(e) =>
                        handleInputChange('totalAmount', parseFloat(e.target.value))
                      }
                      className="bg-muted/20 border-muted/40 text-xl font-bold"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-primary">Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Input
                      value={editedInvoice.billingAddress || ''}
                      onChange={(e) =>
                        handleInputChange('billingAddress', e.target.value)
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-sm text-foreground/70 whitespace-pre-line">
                      {invoice.billingAddress || 'Not provided'}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-secondary">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Input
                      value={editedInvoice.shippingAddress || ''}
                      onChange={(e) =>
                        handleInputChange('shippingAddress', e.target.value)
                      }
                      className="bg-muted/20 border-muted/40"
                    />
                  ) : (
                    <p className="text-sm text-foreground/70 whitespace-pre-line">
                      {invoice.shippingAddress || 'Not provided'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Line Items */}
            {invoice.items && invoice.items.length > 0 && (
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Line Items</CardTitle>
                  <CardDescription>
                    Itemized list of products or services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.unitPrice, invoice.currency)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.amount, invoice.currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Note about editing */}
            {isEditing && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Changes are for UI demonstration purposes
                    only and will not be submitted to the backend. Click "Save
                    Changes" to update the local view or "Cancel" to discard changes.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
