
import React, { useState } from 'react';
import { Book } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BookFormProps {
  book?: Book;
  onSave: (book: Omit<Book, 'id'>) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: book?.title || '',
    author: book?.author || '',
    category: book?.category || '',
    isbn: book?.isbn || '',
    publishedYear: book?.publishedYear || new Date().getFullYear(),
    available: book?.available ?? true,
    coverImage: book?.coverImage || 'https://m.media-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'publishedYear' ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Book Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="publishedYear">Published Year</Label>
          <Input
            id="publishedYear"
            name="publishedYear"
            type="number"
            value={formData.publishedYear}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            id="available"
            name="available"
            type="checkbox"
            checked={formData.available}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="available" className="text-sm font-medium">
            Available for borrowing
          </Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {book ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
