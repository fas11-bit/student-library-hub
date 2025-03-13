
import React from 'react';
import { Book, Users, BookOpen, DollarSign } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { books, members, bookIssues, getBookById, getMemberById } from '@/utils/data';

const Index = () => {
  // Calculate stats
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.available).length;
  const totalMembers = members.length;
  const totalFines = bookIssues.reduce((total, issue) => total + issue.fine, 0);
  
  // Calculate active issues for the dashboard table
  const activeIssues = bookIssues.filter(issue => !issue.returned);

  // Create data for recent issues table
  const recentIssuesData = activeIssues.map(issue => {
    const book = getBookById(issue.bookId);
    const member = getMemberById(issue.memberId);
    
    return {
      id: issue.id,
      bookTitle: book?.title || 'Unknown Book',
      memberName: member?.name || 'Unknown Member',
      issueDate: new Date(issue.issueDate).toLocaleDateString(),
      dueDate: new Date(issue.dueDate).toLocaleDateString(),
      isOverdue: new Date() > new Date(issue.dueDate),
    };
  }).sort((a, b) => {
    // Sort by due date (most urgent first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-8 animate-slide-in-bottom">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Library Management System.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Books" 
          value={totalBooks} 
          icon={Book} 
          color="blue"
          description="Total books in the library"
        />
        <StatCard 
          title="Available Books" 
          value={availableBooks} 
          icon={BookOpen} 
          color="green"
          description={`${Math.round((availableBooks / totalBooks) * 100)}% of total books`}
        />
        <StatCard 
          title="Members" 
          value={totalMembers} 
          icon={Users} 
          color="amber"
        />
        <StatCard 
          title="Total Fines" 
          value={`$${totalFines.toFixed(2)}`} 
          icon={DollarSign} 
          color="rose"
          description="Unpaid fines from overdue books"
        />
      </div>
      
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Recent Book Issues</h2>
        
        <DataTable 
          columns={[
            { header: 'Book Title', accessor: 'bookTitle' },
            { header: 'Borrowed By', accessor: 'memberName' },
            { header: 'Issue Date', accessor: 'issueDate' },
            { 
              header: 'Due Date', 
              accessor: (row) => (
                <span className={row.isOverdue ? 'text-rose-600 font-medium' : ''}>
                  {row.dueDate} {row.isOverdue && '(Overdue)'}
                </span>
              )
            },
          ]}
          data={recentIssuesData}
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default Index;
