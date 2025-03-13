
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publishedYear: number;
  available: boolean;
  coverImage: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  borrowedBooks: BookIssue[];
}

export interface BookIssue {
  id: string;
  bookId: string;
  memberId: string;
  issueDate: string;
  returnDate: string | null;
  dueDate: string;
  returned: boolean;
  fine: number;
}

// Mock data for books
export const books: Book[] = [
  {
    id: "b1",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    isbn: "9780132350884",
    publishedYear: 2008,
    available: true,
    coverImage: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg",
  },
  {
    id: "b2",
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    category: "Programming",
    isbn: "9780201633610",
    publishedYear: 1994,
    available: false,
    coverImage: "https://m.media-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
  },
  {
    id: "b3",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    category: "Programming",
    isbn: "9780201616224",
    publishedYear: 1999,
    available: true,
    coverImage: "https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg",
  },
  {
    id: "b4",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    category: "Computer Science",
    isbn: "9780262033848",
    publishedYear: 2009,
    available: true,
    coverImage: "https://m.media-amazon.com/images/I/41T0iBxY8FL._SX440_BO1,204,203,200_.jpg",
  },
  {
    id: "b5",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    category: "Computer Science",
    isbn: "9780136042594",
    publishedYear: 2009,
    available: true,
    coverImage: "https://m.media-amazon.com/images/I/51qJuR1CJeL._SX440_BO1,204,203,200_.jpg",
  },
  {
    id: "b6",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    category: "Database",
    isbn: "9780073523323",
    publishedYear: 2010,
    available: false,
    coverImage: "https://m.media-amazon.com/images/I/51cF9JHRzxL._SX402_BO1,204,203,200_.jpg",
  },
];

// Mock data for members
export const members: Member[] = [
  {
    id: "m1",
    name: "Ahmed Ali",
    email: "ahmed.ali@university.edu",
    phone: "+966 50 123 4567",
    joinDate: "2022-09-01",
    borrowedBooks: [],
  },
  {
    id: "m2",
    name: "Fatima Mohammed",
    email: "fatima.m@university.edu",
    phone: "+966 55 987 6543",
    joinDate: "2021-10-15",
    borrowedBooks: [],
  },
  {
    id: "m3",
    name: "Omar Ibrahim",
    email: "omar.i@university.edu",
    phone: "+966 54 567 8901",
    joinDate: "2023-01-10",
    borrowedBooks: [],
  },
  {
    id: "m4",
    name: "Sara Abdullah",
    email: "sara.a@university.edu",
    phone: "+966 56 234 5678",
    joinDate: "2022-08-22",
    borrowedBooks: [],
  },
];

// Mock data for book issues
export const bookIssues: BookIssue[] = [
  {
    id: "i1",
    bookId: "b2",
    memberId: "m1",
    issueDate: "2023-09-10",
    returnDate: null,
    dueDate: "2023-09-24",
    returned: false,
    fine: 0,
  },
  {
    id: "i2",
    bookId: "b6",
    memberId: "m2",
    issueDate: "2023-09-05",
    returnDate: null,
    dueDate: "2023-09-19",
    returned: false,
    fine: 0,
  },
];

// Initialize borrowed books
bookIssues.forEach(issue => {
  const member = members.find(m => m.id === issue.memberId);
  if (member) {
    member.borrowedBooks.push(issue);
  }
});

// Helper functions
export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const getMemberById = (id: string): Member | undefined => {
  return members.find(member => member.id === id);
};

export const calculateFine = (dueDate: string, returnDate: string | null): number => {
  if (!returnDate) {
    // Calculate based on current date if not returned yet
    const today = new Date();
    const due = new Date(dueDate);
    
    if (today > due) {
      const diffTime = Math.abs(today.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * 5; // 5 per day
    }
  } else {
    const returned = new Date(returnDate);
    const due = new Date(dueDate);
    
    if (returned > due) {
      const diffTime = Math.abs(returned.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * 5; // 5 per day
    }
  }
  
  return 0;
};
