
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  related_ride_id: string | null;
};

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          setNotifications(data || []);
        }
      } catch (error) {
        console.error('Notification fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        }, 
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error marking notification as read:', error);
      } else {
        setNotifications(prev => 
          prev.map(note => 
            note.id === id ? { ...note, read: true } : note
          )
        );
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        toast({
          title: "Failed to update",
          description: "Could not mark all notifications as read.",
          variant: "destructive",
        });
      } else {
        setNotifications(prev => 
          prev.map(note => ({ ...note, read: true }))
        );
        toast({
          title: "Notifications updated",
          description: "All notifications marked as read.",
        });
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        {loading ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`px-4 py-3 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  )}
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
