
import React from 'react';
import { Member, Book, getBookById } from '@/utils/data';
import { Edit, Trash, Book as BookIcon } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  onEdit, 
  onDelete,
  onViewDetails 
}) => {
  // Calculate active borrowed books (not returned)
  const activeBorrowedBooks = member.borrowedBooks.filter(issue => !issue.returned);
  
  // Get book titles for display
  const borrowedBookTitles = activeBorrowedBooks.map(issue => {
    const book = getBookById(issue.bookId);
    return book?.title || 'Unknown Book';
  });

  const initials = member.name
    .split(' ')
    .slice(0, 2)
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div 
      className="group relative bg-white border border-border/60 rounded-lg p-5 transition-all duration-300 hover:shadow-subtle"
      onClick={() => onViewDetails(member.id)}
    >
      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(member.id);
          }}
          className="rounded-full p-1.5 bg-white/90 text-foreground hover:bg-white transition-colors shadow-sm"
        >
          <Edit size={14} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(member.id);
          }}
          className="rounded-full p-1.5 bg-white/90 text-rose-500 hover:bg-white hover:text-rose-600 transition-colors shadow-sm"
        >
          <Trash size={14} />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {initials}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="font-medium line-clamp-1" title={member.name}>
            {member.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" title={member.email}>
            {member.email}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <BookIcon size={16} className="text-muted-foreground" />
            <span>{activeBorrowedBooks.length} borrowed</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Joined {new Date(member.joinDate).toLocaleDateString()}
          </div>
        </div>
        
        {activeBorrowedBooks.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Currently borrowed:</div>
            <div className="flex flex-wrap gap-1">
              {borrowedBookTitles.map((title, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full truncate max-w-[150px]"
                  title={title}
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
