import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar as CalendarIcon, TrendingUp, AlertCircle, PlusCircle, Check, X, Trash } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest, Meeting } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';
import MeetingCalendar from '../../components/calendar/MeetingCalendar';
import WalletBalance from '../../components/payment/WalletBalance';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));

  const [events, setEvents] = useState<Meeting[]>(() => {
    const raw = localStorage.getItem('events');
    return raw ? (JSON.parse(raw) as Meeting[]) : [];
  });

  
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (user) setCollaborationRequests(getRequestsForEntrepreneur(user.id));
  }, [user]);

  if (!user) return null;

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status } : req))
    );
  };

  const handleScheduleMeeting = (meeting: Meeting) => {
    setEvents(prev => [...prev, meeting]);
  };

  const now = new Date();
  const pendingMeetings = events.filter(e => e.status === 'pending');
  const acceptedUpcoming = events.filter(
    e => e.status === 'accepted' && new Date(e.start) > now
  );
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');

  const acceptMeeting = (id: string) =>
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, status: 'accepted' } : e)));
  const declineMeeting = (id: string) =>
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, status: 'declined' } : e)));
  const deleteMeeting = (id: string) =>
    setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>

        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>
            Find Investors
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <CalendarIcon size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{acceptedUpcoming.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <WalletBalance />
      </div>

      {/* Pending meetings quick actions */}
      {pendingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Pending Meeting Requests</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {pendingMeetings.map(m => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex flex-col">
                  <span className="font-medium">{m.title}</span>
                  <span className="text-sm text-gray-600">{new Date(m.start).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="success" leftIcon={<Check size={14} />} onClick={() => acceptMeeting(m.id)}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<X size={14} />} onClick={() => declineMeeting(m.id)}>
                    Decline
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Trash size={14} />} onClick={() => deleteMeeting(m.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Meeting Calendar */}
      <Card className="bg-accent-50 border border-accent-100">
        <CardHeader>
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-full mr-4">
              <Users size={20} className="text-accent-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-accent-700">Calendar</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <MeetingCalendar initialEvents={events} onEventsChange={setEvents} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>

            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                      onScheduleMeeting={handleScheduleMeeting}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>

            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} showActions={false} />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
