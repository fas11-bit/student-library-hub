
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BookCard from '@/components/books/BookCard';
import BookForm from '@/components/books/BookForm';
import SearchInput from '@/components/ui/SearchInput';
import { Book, books as initialBooks } from '@/utils/data';

const Books = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  
  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddBook = () => {
    setEditingBook(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditBook = (id: string) => {
    const book = books.find(b => b.id === id);
    if (book) {
      setEditingBook(book);
      setIsDialogOpen(true);
    }
  };
  
  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
    toast({
      title: "Book Deleted",
      description: "The book has been removed from the library.",
    });
  };
  
  const handleSaveBook = (bookData: Omit<Book, 'id'>) => {
    if (editingBook) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...bookData } 
          : book
      ));
      toast({
        title: "Book Updated",
        description: "The book has been updated successfully.",
      });
    } else {
      // Add new book
      const newBook: Book = {
        id: `b${books.length + 1}`,
        ...bookData,
      };
      setBooks([...books, newBook]);
      toast({
        title: "Book Added",
        description: "The new book has been added to the library.",
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-in-bottom">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Books</h1>
          <p className="text-muted-foreground mt-1">Manage your library's book collection.</p>
        </div>
        
        <Button onClick={handleAddBook} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, author, or category..."
          className="w-full sm:max-w-sm"
        />
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">No books found.</p>
          <Button variant="outline" onClick={handleAddBook}>
            Add your first book
          </Button>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>
          
          <BookForm
            book={editingBook}
            onSave={handleSaveBook}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Books;
