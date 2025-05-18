
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AreaManager } from '@/components/admin/AreaManager';

const AdminAreas = () => {
  return (
    <AdminLayout activeTab="areas">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Service Areas</h1>
          <p className="text-muted-foreground">
            Manage all service areas and their coverage details.
          </p>
        </div>
        
        <AreaManager />
      </div>
    </AdminLayout>
  );
};

export default AdminAreas;
