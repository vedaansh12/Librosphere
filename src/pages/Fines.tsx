import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FineCalculator } from '@/components/fines/FineCalculator';
import { DollarSign, Calculator, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Fine {
  id: string;
  member_id: string;
  transaction_id: string;
  amount: number;
  reason: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  members: {
    membership_number: string;
    profiles: {
      full_name: string;
      email: string;
    };
  };
}

export default function Fines() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalFines, setTotalFines] = useState({ total: 0, pending: 0, paid: 0 });
  const { toast } = useToast();
  const { isLibrarian } = useAuth();

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const { data, error } = await supabase
        .from('fines')
        .select(`
          *,
          members(
            membership_number,
            profiles(full_name, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFines(data || []);
      
      // Calculate totals
      const total = data?.reduce((sum, fine) => sum + Number(fine.amount), 0) || 0;
      const pending = data?.filter(f => f.status === 'pending').reduce((sum, fine) => sum + Number(fine.amount), 0) || 0;
      const paid = data?.filter(f => f.status === 'paid').reduce((sum, fine) => sum + Number(fine.amount), 0) || 0;
      
      setTotalFines({ total, pending, paid });
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

  const markFineAsPaid = async (fineId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('fines')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', fineId);

      if (error) throw error;

      // Update member's fine amount
      const fine = fines.find(f => f.id === fineId);
      if (fine) {
        const { data: currentMember } = await supabase
          .from('members')
          .select('fine_amount')
          .eq('id', fine.member_id)
          .single();

        const newFineAmount = Math.max(0, (currentMember?.fine_amount || 0) - amount);
        
        await supabase
          .from('members')
          .update({ fine_amount: newFineAmount })
          .eq('id', fine.member_id);
      }

      toast({
        title: "Payment Recorded",
        description: `Fine payment of $${amount.toFixed(2)} has been recorded`,
      });

      fetchFines();
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

  const waiveFine = async (fineId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('fines')
        .update({ 
          status: 'waived',
          paid_at: new Date().toISOString()
        })
        .eq('id', fineId);

      if (error) throw error;

      // Update member's fine amount
      const fine = fines.find(f => f.id === fineId);
      if (fine) {
        const { data: currentMember } = await supabase
          .from('members')
          .select('fine_amount')
          .eq('id', fine.member_id)
          .single();

        const newFineAmount = Math.max(0, (currentMember?.fine_amount || 0) - amount);
        
        await supabase
          .from('members')
          .update({ fine_amount: newFineAmount })
          .eq('id', fine.member_id);
      }

      toast({
        title: "Fine Waived",
        description: `Fine of $${amount.toFixed(2)} has been waived`,
      });

      fetchFines();
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

  const filteredFines = fines.filter(fine =>
    fine.members.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fine.members.membership_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fine.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary">Paid</Badge>;
      case 'waived':
        return <Badge variant="outline">Waived</Badge>;
      default:
        return <Badge variant="destructive">Pending</Badge>;
    }
  };

  if (!isLibrarian) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Fine management is only available to librarians and administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div>Loading fines...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Fines Management</h1>
        <p className="text-muted-foreground">
          Manage library fines, process payments, and track overdue charges.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fines</p>
                <p className="text-2xl font-bold">${totalFines.total.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-destructive">${totalFines.pending.toFixed(2)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collected</p>
                <p className="text-2xl font-bold text-success">${totalFines.paid.toFixed(2)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-fines" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-fines" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            All Fines
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center">
            <Calculator className="mr-2 h-4 w-4" />
            Fine Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-fines" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fine Records ({fines.length})</CardTitle>
                <Input
                  placeholder="Search fines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {fine.members.profiles.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {fine.members.membership_number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-destructive">
                          ${fine.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{fine.reason}</span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(fine.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(fine.status)}
                      </TableCell>
                      <TableCell>
                        {fine.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => markFineAsPaid(fine.id, fine.amount)}
                            >
                              Mark Paid
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => waiveFine(fine.id, fine.amount)}
                            >
                              Waive
                            </Button>
                          </div>
                        )}
                        {fine.paid_at && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(fine.paid_at), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredFines.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No fines found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <FineCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}