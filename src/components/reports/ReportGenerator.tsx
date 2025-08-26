import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calender';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, BarChart } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TransactionReportItem {
  created_at: string;
  transaction_type?: string;
  books?: {
    title?: string;
    isbn?: string;
  };
  members?: {
    membership_number?: string;
    profiles?: {
      full_name?: string;
      email?: string;
      phone?: string;
    };
  };
  profiles?: {
    full_name?: string;
    email?: string;
    phone?: string;
  };
  due_date?: string;
  return_date?: string;
  status?: string;
  membership_number?: string;
  [key: string]: unknown;
}

interface ReportGeneratorProps {
  className?: string;
}

type ReportType = 'transactions' | 'members' | 'books' | 'fines' | 'overdue';

export function ReportGenerator({ className }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('transactions');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<TransactionReportItem[]>([]);
  const { toast } = useToast();

  const generateReport = async () => {
    if (!dateFrom || !dateTo) {
      
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const query = supabase;
      let data;

      switch (reportType) {
        case 'transactions':
          ({ data } = await query
            .from('transactions')
            .select(`
              *,
              books(title, isbn),
              members(membership_number, profiles(full_name))
            `)
            .gte('created_at', dateFrom.toISOString())
            .lte('created_at', dateTo.toISOString())
            .order('created_at', { ascending: false }));
          break;

        case 'members':
          ({ data } = await query
            .from('members')
            .select(`
              *,
              profiles(full_name, email, phone)
            `)
            .gte('created_at', dateFrom.toISOString())
            .lte('created_at', dateTo.toISOString())
            .order('created_at', { ascending: false }));
          break;

        case 'books':
          ({ data } = await query
            .from('books')
            .select(`
              *,
              authors(name),
              categories(name)
            `)
            .gte('created_at', dateFrom.toISOString())
            .lte('created_at', dateTo.toISOString())
            .order('created_at', { ascending: false }));
          break;

        case 'fines':
          ({ data } = await query
            .from('fines')
            .select(`
              *,
              members(membership_number, profiles(full_name))
            `)
            .gte('created_at', dateFrom.toISOString())
            .lte('created_at', dateTo.toISOString())
            .order('created_at', { ascending: false }));
          break;

        case 'overdue':
          ({ data } = await query
            .from('transactions')
            .select(`
              *,
              books(title, isbn),
              members(membership_number, profiles(full_name))
            `)
            .eq('transaction_type', 'checkout')
            .is('return_date', null)
            .lt('due_date', new Date().toISOString())
            .order('due_date', { ascending: true }));
          break;

        default:
          throw new Error('Invalid report type');
      }

      setReportData(data || []);
      toast({
        title: "Success",
        description: `${reportType} report generated with ${data?.length || 0} records`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!reportData.length) {
      toast({
        title: "No Data",
        description: "Please generate a report first",
        variant: "destructive",
      });
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text(`${reportType.toUpperCase()} REPORT`, pageWidth / 2, 20, { align: 'center' });
      
      // Add date range
      pdf.setFontSize(12);
      pdf.text(
        `Period: ${format(dateFrom!, 'dd/MM/yyyy')} - ${format(dateTo!, 'dd/MM/yyyy')}`,
        pageWidth / 2,
        30,
        { align: 'center' }
      );
      
      // Add generated date
      pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, 40, { align: 'center' });
      
      let yPosition = 60;
      
      // Add table headers based on report type
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      
      if (reportType === 'transactions') {
        pdf.text('Date', 10, yPosition);
        pdf.text('Type', 35, yPosition);
        pdf.text('Book', 60, yPosition);
        pdf.text('Member', 120, yPosition);
        pdf.text('Due Date', 170, yPosition);
      } else if (reportType === 'members') {
        pdf.text('Date', 10, yPosition);
        pdf.text('Name', 35, yPosition);
        pdf.text('Email', 80, yPosition);
        pdf.text('Status', 150, yPosition);
      }
      // Add more conditions for other report types...
      
      yPosition += 10;
      pdf.setFont(undefined, 'normal');
      
      // Add data rows
      reportData.slice(0, 40).forEach((item) => { // Limit to 40 rows for demo
        if (yPosition > 280) { // Add new page if needed
          pdf.addPage();
          yPosition = 20;
        }
        
        if (reportType === 'transactions') {
          pdf.text(format(new Date(item.created_at), 'dd/MM/yy'), 10, yPosition);
          pdf.text(item.transaction_type, 35, yPosition);
          pdf.text((item.books?.title || 'N/A').substring(0, 25), 60, yPosition);
          pdf.text((item.members?.profiles?.full_name || 'N/A').substring(0, 20), 120, yPosition);
          pdf.text(item.due_date ? format(new Date(item.due_date), 'dd/MM/yy') : 'N/A', 170, yPosition);
        }
        // Add more conditions for other report types...
        
        yPosition += 8;
      });
      
      // Add footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.text(
          `Page ${i} of ${totalPages} | Total Records: ${reportData.length}`,
          pageWidth / 2,
          290,
          { align: 'center' }
        );
      }
      
      pdf.save(`${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Success",
        description: "Report exported to PDF successfully",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    if (!reportData.length) {
      toast({
        title: "No Data",
        description: "Please generate a report first",
        variant: "destructive",
      });
      return;
    }

    try {
      let csvContent = '';
      
      // Add headers based on report type
      if (reportType === 'transactions') {
        csvContent = 'Date,Type,Book Title,Member Name,Due Date,Return Date\n';
        reportData.forEach(item => {
          csvContent += `${format(new Date(item.created_at), 'yyyy-MM-dd')},${item.transaction_type},"${item.books?.title || 'N/A'}","${item.members?.profiles?.full_name || 'N/A'}",${item.due_date ? format(new Date(item.due_date), 'yyyy-MM-dd') : 'N/A'},${item.return_date ? format(new Date(item.return_date), 'yyyy-MM-dd') : 'N/A'}\n`;
        });
      } else if (reportType === 'members') {
        csvContent = 'Date,Name,Email,Phone,Status,Membership Number\n';
        reportData.forEach(item => {
          csvContent += `${format(new Date(item.created_at), 'yyyy-MM-dd')},"${item.profiles?.full_name || 'N/A'}","${item.profiles?.email || 'N/A'}","${item.profiles?.phone || 'N/A'}",${item.status},${item.membership_number}\n`;
        });
      }
      // Add more conditions for other report types...
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Report exported to CSV successfully",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export CSV",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5" />
          Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="fines">Fines</SelectItem>
                <SelectItem value="overdue">Overdue Books</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={generateReport} disabled={loading} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {reportData.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Generated {reportData.length} records
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportToPDF} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={exportToCSV} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}