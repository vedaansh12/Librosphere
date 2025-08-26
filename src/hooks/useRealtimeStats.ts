import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface LibraryStats {
  totalBooks: number;
  activeMembers: number;
  booksIssued: number;
  overdueBooks: number;
  totalReservations: number;
  totalFines: number;
}

interface RecentActivity {
  id: string;
  action: string;
  book_title: string;
  member_name: string;
  time: string;
  type: 'checkout' | 'return' | 'reservation' | 'registration';
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    activeMembers: 0,
    booksIssued: 0,
    overdueBooks: 0,
    totalReservations: 0,
    totalFines: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        booksResult,
        membersResult,
        transactionsResult,
        reservationsResult,
        finesResult,
      ] = await Promise.all([
        supabase.from('books').select('id, available_copies, total_copies'),
        supabase.from('members').select('id, status').eq('status', 'active'),
        supabase.from('transactions')
          .select('id, return_date, due_date')
          .eq('transaction_type', 'checkout'),
        supabase.from('reservations').select('id').eq('status', 'active'),
        supabase.from('fines').select('amount').eq('status', 'pending'),
      ]);

      if (booksResult.data && membersResult.data && transactionsResult.data) {
        const totalBooks = booksResult.data.reduce((sum, book) => sum + book.total_copies, 0);
        const booksIssued = transactionsResult.data.filter(t => !t.return_date).length;
        const overdueBooks = transactionsResult.data.filter(
          t => !t.return_date && t.due_date && new Date(t.due_date) < new Date()
        ).length;

        setStats({
          totalBooks,
          activeMembers: membersResult.data.length,
          booksIssued,
          overdueBooks,
          totalReservations: reservationsResult.data?.length || 0,
          totalFines: finesResult.data?.reduce((sum, fine) => sum + Number(fine.amount), 0) || 0,
        });
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error('Error fetching stats:', err.message);
  } else {
    console.error('Error fetching stats:', err);
  }
}
};

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent transactions with book and member data
      const { data: transactions } = await supabase
        .from('transactions')
        .select(`
          id,
          transaction_type,
          checkout_date,
          return_date,
          created_at,
          books(title),
          members!inner(profiles!inner(full_name))
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent member registrations
      const { data: members } = await supabase
        .from('members')
        .select(`
          id,
          created_at,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = [];

      // Add transaction activities
      transactions?.forEach(transaction => {
        const memberName = ((transaction.members as { profiles?: { full_name?: string } })?.profiles?.full_name) ||'Unknown Member';
        const bookTitle = ((transaction.books as { title?: string })?.title) ||'Unknown Book';
        
        if (transaction.return_date) {
          activities.push({
            id: `return-${transaction.id}`,
            action: 'Book returned',
            book_title: bookTitle,
            member_name: memberName,
            time: formatRelativeTime(transaction.return_date),
            type: 'return',
          });
        } else if (transaction.checkout_date) {
          activities.push({
            id: `checkout-${transaction.id}`,
            action: 'Book issued',
            book_title: bookTitle,
            member_name: memberName,
            time: formatRelativeTime(transaction.checkout_date),
            type: 'checkout',
          });
        }
      });

      // Add member registration activities
      members?.forEach(member => {
        const memberName = ((member.profiles as { full_name?: string })?.full_name) ||'Unknown Member';
        activities.push({
          id: `registration-${member.id}`,
          action: 'New member',
          book_title: 'User Registration',
          member_name: memberName,
          time: formatRelativeTime(member.created_at),
          type: 'registration',
        });
      });

      // Sort by most recent and limit to 8
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivities(activities.slice(0, 8));
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error('Error fetching recent activities:', err.message);
  } else {
    console.error('Error fetching recent activities:', err);
  }
}
};

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRecentActivities()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscriptions
    const statsChannel = supabase
      .channel('dashboard-stats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'books' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          fetchStats();
          fetchRecentActivities();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fines' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
    };
  }, []);

  return { stats, recentActivities, loading, refetch: () => Promise.all([fetchStats(), fetchRecentActivities()]) };
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}