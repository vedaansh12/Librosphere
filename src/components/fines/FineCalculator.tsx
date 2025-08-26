import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, Calculator } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FineCalculatorProps {
  transactionId?: string;
  dueDate?: string;
  returnDate?: string;
  onFineCalculated?: (amount: number) => void;
}

const FINE_RATES = {
  daily: 0.50, // $0.50 per day
  weekly: 3.00, // $3.00 per week
  grace_period: 3, // 3 days grace period
};

export function FineCalculator({ 
  transactionId, 
  dueDate, 
  returnDate,
  onFineCalculated 
}: FineCalculatorProps) {
  const [customDueDate, setCustomDueDate] = useState(dueDate || '');
  const [customReturnDate, setCustomReturnDate] = useState(returnDate || new Date().toISOString().split('T')[0]);
  const [fineAmount, setFineAmount] = useState(0);
  const [overdueDays, setOverdueDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (customDueDate && customReturnDate) {
      calculateFine();
    }
  }, [customDueDate, customReturnDate]);

  const calculateFine = () => {
    if (!customDueDate || !customReturnDate) return;

    const due = parseISO(customDueDate);
    const returned = parseISO(customReturnDate);
    const daysDiff = differenceInDays(returned, due);

    setOverdueDays(Math.max(0, daysDiff));

    if (daysDiff <= FINE_RATES.grace_period) {
      setFineAmount(0);
    } else {
      const fineDays = daysDiff - FINE_RATES.grace_period;
      const amount = fineDays * FINE_RATES.daily;
      setFineAmount(Math.max(0, amount));
    }
  };

  const applyFine = async () => {
    if (!transactionId || fineAmount <= 0) {
      toast({
        title: "No Fine to Apply",
        description: "No overdue amount calculated",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get transaction details
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .select('member_id')
        .eq('id', transactionId)
        .single();

      if (transactionError) throw transactionError;

      // Create fine record
      const { error: fineError } = await supabase
        .from('fines')
        .insert({
          member_id: transaction.member_id,
          transaction_id: transactionId,
          amount: fineAmount,
          reason: `Late return - ${overdueDays} days overdue`,
          status: 'pending',
        });

      if (fineError) throw fineError;

      // Update member's fine amount
      const { data: currentMember } = await supabase
        .from('members')
        .select('fine_amount')
        .eq('id', transaction.member_id)
        .single();

      const newFineAmount = (currentMember?.fine_amount || 0) + fineAmount;
      
      const { error: memberError } = await supabase
        .from('members')
        .update({ fine_amount: newFineAmount })
        .eq('id', transaction.member_id);

      if (memberError) throw memberError;

      onFineCalculated?.(fineAmount);
      toast({
        title: "Fine Applied",
        description: `Fine of $${fineAmount.toFixed(2)} has been applied`,
      });
    } catch (error: unknown) {
  if (error instanceof Error) {
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  }
} finally {
  setLoading(false);
}
};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Fine Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={customDueDate}
              onChange={(e) => setCustomDueDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-date">Return Date</Label>
            <Input
              id="return-date"
              type="date"
              value={customReturnDate}
              onChange={(e) => setCustomReturnDate(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Days Overdue:</span>
            <Badge variant={overdueDays > 0 ? "destructive" : "secondary"}>
              {overdueDays} days
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Grace Period:</span>
            <span className="text-sm text-muted-foreground">
              {FINE_RATES.grace_period} days
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Daily Rate:</span>
            <span className="text-sm text-muted-foreground">
              ${FINE_RATES.daily}/day
            </span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Fine:</span>
              <span className="text-lg font-bold text-destructive">
                ${fineAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {fineAmount > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Fine Calculation Breakdown:
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {overdueDays} days overdue - {FINE_RATES.grace_period} grace days = {Math.max(0, overdueDays - FINE_RATES.grace_period)} chargeable days × ${FINE_RATES.daily} = ${fineAmount.toFixed(2)}
            </p>
          </div>
        )}

        {transactionId && fineAmount > 0 && (
          <Button 
            onClick={applyFine} 
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {loading ? 'Applying Fine...' : `Apply Fine ($${fineAmount.toFixed(2)})`}
          </Button>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Grace period: {FINE_RATES.grace_period} days (no fine)</p>
          <p>• Daily rate: ${FINE_RATES.daily} per day after grace period</p>
          <p>• Weekend days are included in calculation</p>
        </div>
      </CardContent>
    </Card>
  );
}