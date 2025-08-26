import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.destroy();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      // Check if QR scanner is supported
      if (!QrScanner.hasCamera()) {
        toast({
          title: "Camera Not Available",
          description: "No camera found on this device",
          variant: "destructive",
        });
        return;
      }

      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code scanned:', result.data);
          onScan(result.data);
          stopScanning();
          toast({
            title: "QR Code Scanned",
            description: "Successfully scanned QR code",
          });
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera if available
        }
      );

      await qrScanner.start();
      setScanner(qrScanner);
      setIsScanning(true);
      setHasPermission(true);

      toast({
        title: "Camera Started",
        description: "Point the camera at a QR code to scan",
      });
    } catch (error) {
      console.error('Error starting scanner:', error);
      setHasPermission(false);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
      setScanner(null);
    }
    setIsScanning(false);
  };

  const toggleScanning = () => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            QR Scanner
          </span>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-square object-cover rounded-lg bg-muted"
            style={{ display: isScanning ? 'block' : 'none' }}
          />
          {!isScanning && (
            <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Camera preview will appear here
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={toggleScanning}
            disabled={hasPermission === false}
            className="flex-1"
            variant={isScanning ? "destructive" : "default"}
          >
            {isScanning ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Stop Scanning
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Scanning
              </>
            )}
          </Button>
          
          {isScanning && (
            <Button variant="outline" onClick={() => {
              stopScanning();
              setTimeout(startScanning, 100);
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {hasPermission === false && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Camera access is required to scan QR codes.</p>
            <p>Please enable camera permissions and try again.</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>Position the QR code within the camera view to scan automatically.</p>
        </div>
      </CardContent>
    </Card>
  );
}