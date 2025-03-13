
import React from 'react';
import { Book } from '@/utils/data';
import { cn } from '@/lib/utils';
import { Edit, Trash, Check, X } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/60 bg-white transition-all duration-300 hover:shadow-subtle">
      <div className="aspect-[2/3] overflow-hidden bg-muted/20">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <button 
          onClick={() => onEdit(book.id)}
          className="rounded-full p-1.5 bg-white/90 text-foreground hover:bg-white transition-colors shadow-sm"
        >
          <Edit size={14} />
        </button>
        <button 
          onClick={() => onDelete(book.id)}
          className="rounded-full p-1.5 bg-white/90 text-rose-500 hover:bg-white hover:text-rose-600 transition-colors shadow-sm"
        >
          <Trash size={14} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm leading-tight line-clamp-1" title={book.title}>
            {book.title}
          </h3>
          <div className={cn(
            "flex items-center justify-center rounded-full h-5 w-5 text-xs",
            book.available 
              ? "bg-green-50 text-green-600"
              : "bg-rose-50 text-rose-600"
          )}>
            {book.available ? <Check size={12} /> : <X size={12} />}
          </div>
        </div>
        
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1" title={book.author}>
          {book.author}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
            {book.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {book.publishedYear}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
