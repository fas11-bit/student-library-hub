
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MemberCard from '@/components/members/MemberCard';
import MemberForm from '@/components/members/MemberForm';
import SearchInput from '@/components/ui/SearchInput';
import { Member, members as initialMembers } from '@/utils/data';

const Members = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  
  // Filter members based on search query
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddMember = () => {
    setEditingMember(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditMember = (id: string) => {
    const member = members.find(m => m.id === id);
    if (member) {
      setEditingMember(member);
      setIsDialogOpen(true);
    }
  };
  
  const handleDeleteMember = (id: string) => {
    // Check if member has any borrowings before deleting
    const member = members.find(m => m.id === id);
    if (member && member.borrowedBooks.some(book => !book.returned)) {
      toast({
        title: "Cannot Delete Member",
        description: "This member has unreturned books. Please ensure all books are returned before deleting.",
        variant: "destructive",
      });
      return;
    }
    
    setMembers(members.filter(member => member.id !== id));
    toast({
      title: "Member Deleted",
      description: "The member has been removed from the system.",
    });
  };
  
  const handleSaveMember = (memberData: Omit<Member, 'id' | 'borrowedBooks'>) => {
    if (editingMember) {
      // Update existing member
      setMembers(members.map(member => 
        member.id === editingMember.id 
          ? { ...member, ...memberData } 
          : member
      ));
      toast({
        title: "Member Updated",
        description: "The member has been updated successfully.",
      });
    } else {
      // Add new member
      const newMember: Member = {
        id: `m${members.length + 1}`,
        ...memberData,
        borrowedBooks: [],
      };
      setMembers([...members, newMember]);
      toast({
        title: "Member Added",
        description: "The new member has been added to the system.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleViewMemberDetails = (id: string) => {
    // In a real app, this would navigate to a detailed view
    toast({
      title: "Member Details",
      description: "Viewing member details is not implemented in this demo.",
    });
  };

  return (
    <div className="space-y-6 animate-slide-in-bottom">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Members</h1>
          <p className="text-muted-foreground mt-1">Manage library members and their borrowings.</p>
        </div>
        
        <Button onClick={handleAddMember} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or email..."
          className="w-full sm:max-w-sm"
        />
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>
      
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
              onViewDetails={handleViewMemberDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">No members found.</p>
          <Button variant="outline" onClick={handleAddMember}>
            Add your first member
          </Button>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
          </DialogHeader>
          
          <MemberForm
            member={editingMember}
            onSave={handleSaveMember}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
