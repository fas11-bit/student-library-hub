
import React, { useState } from 'react';
import { Member } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MemberFormProps {
  member?: Member;
  onSave: (member: Omit<Member, 'id' | 'borrowedBooks'>) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Member, 'id' | 'borrowedBooks'>>({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="joinDate">Join Date</Label>
          <Input
            id="joinDate"
            name="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={handleChange}
            required
            className="focus-ring"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {member ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
