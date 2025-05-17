
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Pencil, Trash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ServiceArea {
  id: string;
  name: string;
  description: string;
  availability: string;
  isActive: boolean;
}

export const AreaManager = () => {
  const { toast } = useToast();
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    availability: '',
  });

  // Mock data for areas
  const [areas, setAreas] = useState<ServiceArea[]>([
    {
      id: '1',
      name: 'Downtown Business District',
      description: 'Covering all major office buildings and corporate headquarters in the central business district.',
      availability: '24/7',
      isActive: true,
    },
    {
      id: '2',
      name: 'Tech Park Zone',
      description: 'Service to all technology parks and innovation centers in the eastern corridor.',
      availability: '5:00 AM - 11:00 PM',
      isActive: true,
    },
    {
      id: '3',
      name: 'Airport & Transport Hubs',
      description: 'Regular service to and from all major airports, train stations and transport terminals.',
      availability: '24/7',
      isActive: true,
    },
    {
      id: '4',
      name: 'Industrial Area',
      description: 'Covering manufacturing plants and industrial complexes in the western sector.',
      availability: '6:00 AM - 10:00 PM',
      isActive: false,
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingArea) {
      // Update existing area
      const updatedAreas = areas.map(area => 
        area.id === editingArea.id 
          ? { ...area, ...formData } 
          : area
      );
      setAreas(updatedAreas);
      
      toast({
        title: "Area Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      
      setEditingArea(null);
    } else {
      // Add new area
      const newArea: ServiceArea = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
      };
      
      setAreas([...areas, newArea]);
      
      toast({
        title: "Area Added",
        description: `${formData.name} has been added to service areas.`,
      });
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      availability: '',
    });
  };

  const handleEdit = (area: ServiceArea) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      description: area.description,
      availability: area.availability,
    });
  };

  const handleDelete = (id: string) => {
    setAreas(areas.filter(area => area.id !== id));
    
    toast({
      title: "Area Removed",
      description: "The service area has been removed.",
    });
    
    // If editing the area being deleted, reset the form
    if (editingArea?.id === id) {
      setEditingArea(null);
      setFormData({
        name: '',
        description: '',
        availability: '',
      });
    }
  };

  const handleToggleActive = (id: string) => {
    const updatedAreas = areas.map(area => 
      area.id === id 
        ? { ...area, isActive: !area.isActive } 
        : area
    );
    setAreas(updatedAreas);
    
    const area = areas.find(a => a.id === id);
    const newStatus = !area?.isActive;
    
    toast({
      title: newStatus ? "Area Activated" : "Area Deactivated",
      description: `${area?.name} is now ${newStatus ? 'active' : 'inactive'}.`,
    });
  };

  const handleCancel = () => {
    setEditingArea(null);
    setFormData({
      name: '',
      description: '',
      availability: '',
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingArea ? 'Edit Service Area' : 'Add Service Area'}
          </CardTitle>
          <CardDescription>
            {editingArea 
              ? 'Update the details of an existing service area'
              : 'Define a new area where cabs will be available'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Area Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Downtown Business District"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the coverage of this service area"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability">Availability Hours</Label>
              <Input
                id="availability"
                name="availability"
                placeholder="e.g., 24/7 or 8:00 AM - 9:00 PM"
                value={formData.availability}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit">
                {editingArea ? 'Update Area' : 'Add Area'}
              </Button>
              {editingArea && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            Manage existing service areas and their availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-maverick-600" />
                      {area.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-md truncate">
                    {area.description}
                  </TableCell>
                  <TableCell>{area.availability}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={area.isActive} 
                      onCheckedChange={() => handleToggleActive(area.id)} 
                      aria-label={`${area.name} status`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(area)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(area.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
