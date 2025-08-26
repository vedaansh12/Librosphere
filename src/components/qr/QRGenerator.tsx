import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Download, Printer } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  type?: 'book' | 'member' | 'custom';
  data?: unknown;
  onGenerated?: (qrData: string) => void;
}

export function QRGenerator({ type = 'custom', data, onGenerated }: QRGeneratorProps) {
  const [qrText, setQrText] = useState('');
  const [qrType, setQrType] = useState(type);
  const [qrImage, setQrImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateQR = async () => {
    if (!qrText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or data to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let qrData = qrText;
      
      // Format data based on type
      type BookData = {
      id: string;
      title: string;
      isbn: string;
      author_name: string;
    };

      type MemberData = {
        id: string;
        membership_number: string;
        profile?: { full_name: string };
      };

      if (qrType === 'book' && data) {
        const book = data as BookData; // type assertion here
        qrData = JSON.stringify({
          type: 'book',
          id: book.id,
          title: book.title,
          isbn: book.isbn,
          author: book.author_name,
        });
      } else if (qrType === 'member' && data) {
        const member = data as MemberData;
        qrData = JSON.stringify({
          type: 'member',
          id: member.id,
          membershipNumber: member.membership_number,
          name: member.profile?.full_name,
        });
      }

      const qrCodeImage = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });

      setQrImage(qrCodeImage);
      onGenerated?.(qrData);
      toast({
        title: "Success",
        description: "QR code generated successfully",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement('a');
    link.download = `qr-code-${qrType}-${Date.now()}.png`;
    link.href = qrImage;
    link.click();
  };

  const printQR = () => {
    if (!qrImage) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code</title>
            <style>
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
                border: 2px solid #000;
                padding: 20px;
                border-radius: 8px;
              }
              img { max-width: 300px; }
              h2 { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>${qrType.toUpperCase()} QR Code</h2>
              <img src="${qrImage}" alt="QR Code" />
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                Generated on ${new Date().toLocaleDateString()}
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-type">QR Code Type</Label>
          <Select value={qrType} onValueChange={(value: 'book' | 'member' | 'custom') => setQrType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">Book QR</SelectItem>
              <SelectItem value="member">Member QR</SelectItem>
              <SelectItem value="custom">Custom Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qr-text">
            {qrType === 'custom' ? 'Text/URL' : 'Additional Data'}
          </Label>
          <Input
            id="qr-text"
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            placeholder={
              qrType === 'custom' 
                ? 'Enter text or URL to encode'
                : 'Optional additional data'
            }
          />
        </div>

        <Button 
          onClick={generateQR} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate QR Code'}
        </Button>

        {qrImage && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={qrImage} alt="Generated QR Code" className="border rounded-lg" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={downloadQR} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={printQR} className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}