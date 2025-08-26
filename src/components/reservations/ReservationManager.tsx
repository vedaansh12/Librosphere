import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format, isAfter, parseISO } from 'date-fns';

interface Reservation {
  id: string;
  book_id: string;
  member_id: string;
  reservation_date: string;
  expiry_date: string;
  status: string;
  books: {
    title: string;
    isbn: string;
    available_copies: number;
  };
  members: {
    membership_number: string;
    profiles: {
      full_name: string;
      email: string;
    };
  };
}

export function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookSearch, setBookSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const { toast } = useToast();
  const { isLibrarian } = useAuth();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          books(title, isbn, available_copies),
          members(membership_number, profiles(full_name, email))
        `)
        .order('reservation_date', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
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

  const createReservation = async () => {
    if (!bookSearch || !memberSearch) {
      toast({
        title: "Missing Information",
        description: "Please enter both book and member details",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find book
      const { data: books, error: bookError } = await supabase
        .from('books')
        .select('id, title, available_copies')
        .or(`title.ilike.%${bookSearch}%,isbn.ilike.%${bookSearch}%`)
        .limit(1);

      if (bookError) throw bookError;
      if (!books?.length) {
        toast({
          title: "Book Not Found",
          description: "No book found with that title or ISBN",
          variant: "destructive",
        });
        return;
      }

      // Find member
      const { data: members, error: memberError } = await supabase
        .from('members')
        .select(`
          id,
          profiles(full_name, email)
        `)
        .or(`membership_number.ilike.%${memberSearch}%`)
        .limit(1);

      if (memberError) throw memberError;
      if (!members?.length) {
        toast({
          title: "Member Not Found",
          description: "No member found with that membership number",
          variant: "destructive",
        });
        return;
      }

      const book = books[0];
      const member = members[0];

      // Check if book is available for reservation
      if (book.available_copies <= 0) {
        // Check existing reservations
        const { data: existingReservations } = await supabase
          .from('reservations')
          .select('id')
          .eq('book_id', book.id)
          .eq('member_id', member.id)
          .eq('status', 'active');

        if (existingReservations?.length) {
          toast({
            title: "Already Reserved",
            description: "This member already has an active reservation for this book",
            variant: "destructive",
          });
          return;
        }

        // Create reservation
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

        const { error: reservationError } = await supabase
          .from('reservations')
          .insert({
            book_id: book.id,
            member_id: member.id,
            expiry_date: expiryDate.toISOString(),
            status: 'active',
          });

        if (reservationError) throw reservationError;

        toast({
          title: "Reservation Created",
          description: `Book reserved for ${member.profiles?.full_name}`,
        });

        setBookSearch('');
        setMemberSearch('');
        fetchReservations();
      } else {
        toast({
          title: "Book Available",
          description: "This book is currently available for checkout",
          variant: "destructive",
        });
      }
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
}
};

  const updateReservationStatus = async (reservationId: string, status: 'fulfilled' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Reservation ${status}`,
      });

      fetchReservations();
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
}
};

  const getStatusBadge = (reservation: Reservation) => {
    const isExpired = isAfter(new Date(), parseISO(reservation.expiry_date));
    
    if (reservation.status === 'fulfilled') {
      return <Badge variant="secondary">Fulfilled</Badge>;
    }
    if (reservation.status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  return (
    <div className="space-y-6">
      {isLibrarian && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Create New Reservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="book-search">Book (Title or ISBN)</Label>
                <Input
                  id="book-search"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Enter book title or ISBN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-search">Member (Membership Number)</Label>
                <Input
                  id="member-search"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Enter membership number"
                />
              </div>
            </div>
            <Button onClick={createReservation} className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Create Reservation
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            All Reservations ({reservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Reserved Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                {isLibrarian && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{reservation.books?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ISBN: {reservation.books?.isbn}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {reservation.members?.profiles?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.members?.membership_number}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(reservation.reservation_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(reservation.expiry_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reservation)}
                  </TableCell>
                  {isLibrarian && (
                    <TableCell>
                      {reservation.status === 'active' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReservationStatus(reservation.id, 'fulfilled')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {reservations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reservations found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}