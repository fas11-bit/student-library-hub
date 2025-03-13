
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/ui/DataTable';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Book,
  Member,
  BookIssue,
  books as initialBooks,
  members as initialMembers,
  bookIssues as initialBookIssues,
  getBookById,
  calculateFine
} from '@/utils/data';

const IssueReturn = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [bookIssues, setBookIssues] = useState<BookIssue[]>(initialBookIssues);
  
  // Form states
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'issue' | 'return'>('issue');
  
  // Available books (for issue)
  const availableBooks = books.filter(book => book.available);
  
  // Borrowed books (for return)
  const activeIssues = bookIssues.filter(issue => !issue.returned);
  const issuedBooks = activeIssues.map(issue => {
    const book = getBookById(issue.bookId);
    const member = members.find(m => m.id === issue.memberId);
    
    return {
      issueId: issue.id,
      bookId: issue.bookId,
      bookTitle: book?.title || 'Unknown Book',
      memberId: issue.memberId,
      memberName: member?.name || 'Unknown Member',
      issueDate: new Date(issue.issueDate).toLocaleDateString(),
      dueDate: new Date(issue.dueDate).toLocaleDateString(),
      fine: calculateFine(issue.dueDate, null),
      isOverdue: new Date() > new Date(issue.dueDate),
    };
  });
  
  // Handle book issuance
  const handleIssueBook = () => {
    if (!selectedBookId || !selectedMemberId) {
      toast({
        title: "Error",
        description: "Please select both a book and a member.",
        variant: "destructive",
      });
      return;
    }
    
    // Create issue date (today)
    const issueDate = new Date().toISOString().split('T')[0];
    
    // Create due date (14 days from today)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    // Create new issue record
    const newIssue: BookIssue = {
      id: `i${bookIssues.length + 1}`,
      bookId: selectedBookId,
      memberId: selectedMemberId,
      issueDate,
      returnDate: null,
      dueDate: dueDateStr,
      returned: false,
      fine: 0,
    };
    
    // Update book availability
    setBooks(books.map(book => 
      book.id === selectedBookId 
        ? { ...book, available: false } 
        : book
    ));
    
    // Add to member's borrowed books
    setMembers(members.map(member => 
      member.id === selectedMemberId
        ? { ...member, borrowedBooks: [...member.borrowedBooks, newIssue] }
        : member
    ));
    
    // Add to issues
    setBookIssues([...bookIssues, newIssue]);
    
    // Reset form
    setSelectedBookId('');
    setSelectedMemberId('');
    
    toast({
      title: "Book Issued",
      description: "The book has been successfully issued to the member.",
    });
  };
  
  // Handle book return
  const handleReturnBook = (issueId: string) => {
    const issue = bookIssues.find(i => i.id === issueId);
    if (!issue) return;
    
    // Calculate fine if overdue
    const returnDate = new Date().toISOString().split('T')[0];
    const fine = calculateFine(issue.dueDate, returnDate);
    
    // Update issue record
    setBookIssues(bookIssues.map(i => 
      i.id === issueId
        ? { ...i, returned: true, returnDate, fine }
        : i
    ));
    
    // Update book availability
    setBooks(books.map(book => 
      book.id === issue.bookId
        ? { ...book, available: true }
        : book
    ));
    
    // Update member's borrowed books
    setMembers(members.map(member => 
      member.id === issue.memberId
        ? { 
            ...member, 
            borrowedBooks: member.borrowedBooks.map(b => 
              b.id === issueId
                ? { ...b, returned: true, returnDate, fine }
                : b
            ) 
          }
        : member
    ));
    
    toast({
      title: "Book Returned",
      description: fine > 0 
        ? `Book has been returned. A fine of $${fine.toFixed(2)} has been applied.`
        : "Book has been returned successfully with no fine.",
    });
  };
  
  return (
    <div className="space-y-8 animate-slide-in-bottom">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Issue & Return</h1>
        <p className="text-muted-foreground mt-1">Manage the circulation of books in your library.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Mode selector */}
          <div className="flex rounded-lg overflow-hidden border border-border/60 mb-6">
            <button
              className={`flex-1 py-2.5 text-center text-sm transition-all duration-200 ${
                viewMode === 'issue'
                  ? 'bg-primary text-white font-medium'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => setViewMode('issue')}
            >
              Issue Book
            </button>
            <button
              className={`flex-1 py-2.5 text-center text-sm transition-all duration-200 ${
                viewMode === 'return'
                  ? 'bg-primary text-white font-medium'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => setViewMode('return')}
            >
              Return Book
            </button>
          </div>
          
          {viewMode === 'issue' ? (
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Issue a Book</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="book">Select Book</Label>
                  <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                    <SelectTrigger id="book" className="w-full">
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBooks.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No books available for issue
                        </SelectItem>
                      ) : (
                        availableBooks.map(book => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} by {book.author}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger id="member" className="w-full">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleIssueBook}
                  disabled={!selectedBookId || !selectedMemberId}
                >
                  Issue Book <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Return a Book</h2>
              
              {issuedBooks.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select a book from the list below to process a return.
                  </p>
                  
                  <DataTable
                    columns={[
                      { 
                        header: 'Book', 
                        accessor: 'bookTitle',
                        className: 'font-medium'
                      },
                      { 
                        header: 'Borrowed By', 
                        accessor: 'memberName' 
                      },
                      { 
                        header: 'Status', 
                        accessor: (row) => (
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit ${
                            row.isOverdue
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-green-50 text-green-600'
                          }`}>
                            {row.isOverdue ? (
                              <>
                                <AlertCircle size={12} />
                                Overdue
                              </>
                            ) : (
                              <>
                                <CheckCircle size={12} />
                                On time
                              </>
                            )}
                          </span>
                        ),
                      },
                      {
                        header: 'Fine',
                        accessor: (row) => (
                          row.fine > 0 ? `$${row.fine.toFixed(2)}` : '-'
                        ),
                      },
                      {
                        header: 'Action',
                        accessor: (row) => (
                          <Button
                            size="sm"
                            onClick={() => handleReturnBook(row.issueId)}
                          >
                            Return
                          </Button>
                        ),
                        className: 'text-right',
                      },
                    ]}
                    data={issuedBooks}
                    keyExtractor={(row) => row.issueId}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No books currently issued.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="glass-effect rounded-xl p-5">
            <h3 className="font-medium mb-2">Library Statistics</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Total Books:</span>
                <span className="font-medium">{books.length}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Available Books:</span>
                <span className="font-medium">{availableBooks.length}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Issued Books:</span>
                <span className="font-medium">{books.length - availableBooks.length}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Total Members:</span>
                <span className="font-medium">{members.length}</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-effect rounded-xl p-5">
            <h3 className="font-medium mb-2">Issue Rules</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Books are issued for 14 days</li>
              <li>• Maximum 3 books per member</li>
              <li>• Fine: $5 per day for late returns</li>
              <li>• Lost books are charged at full cost</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueReturn;
