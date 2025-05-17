
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash, User, Phone, Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  role: string;
}

export const ContactManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for contacts
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@company.com',
      department: 'Human Resources',
      role: 'HR Director',
    },
    {
      id: '2',
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      email: 'jane.doe@company.com',
      department: 'Finance',
      role: 'Finance Manager',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      phone: '+1 (555) 234-5678',
      email: 'robert.j@company.com',
      department: 'Operations',
      role: 'Operations Lead',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      phone: '+1 (555) 456-7890',
      email: 'sarah.w@company.com',
      department: 'IT',
      role: 'IT Support',
    },
    {
      id: '5',
      name: 'Michael Brown',
      phone: '+1 (555) 789-0123',
      email: 'michael.b@company.com',
      department: 'Marketing',
      role: 'Marketing Director',
    },
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.department.toLowerCase().includes(searchLower) ||
      contact.role.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    
    toast({
      title: "Contact Deleted",
      description: "The contact has been removed successfully.",
    });
  };

  const handleEditContact = (id: string) => {
    // In a real app, this would open a modal or navigate to an edit page
    toast({
      title: "Edit Contact",
      description: "This would open the contact editing form.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Management</CardTitle>
        <CardDescription>
          View and manage all employee contacts for cab booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-maverick-600" />
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {contact.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {contact.department}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {contact.role}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditContact(contact.id)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No contacts found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
