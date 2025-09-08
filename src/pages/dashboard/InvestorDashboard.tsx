import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, Check, X, Trash } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { Meeting } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import MeetingCalendar from '../../components/calendar/MeetingCalendar';
// NOTE: match your folder name: 'payments'
import WalletBalance from '../../components/payment/WalletBalance';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Meeting[]>(() => {
    const stored = localStorage.getItem('events');
    return stored ? (JSON.parse(stored) as Meeting[]) : [];
  });
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  if (!user) return null;

  const sentRequests = getRequestsFromInvestor(user.id);

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      entrepreneur.name.toLowerCase().includes(q) ||
      entrepreneur.startupName.toLowerCase().includes(q) ||
      entrepreneur.industry.toLowerCase().includes(q) ||
      entrepreneur.pitchSummary.toLowerCase().includes(q);

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);

    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  // schedule meeting from accepted request (via modal)
  const handleScheduleMeeting = (meeting: Meeting) => {
    setEvents(prev => [...prev, meeting]);
  };

  const now = new Date();
  const pendingMeetings = events.filter(e => e.status === 'pending');
  const acceptedUpcoming = events.filter(e => e.status === 'accepted' && new Date(e.start) > now);

  const acceptMeeting = (id: string) =>
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, status: 'accepted' } : e)));
  const declineMeeting = (id: string) =>
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, status: 'declined' } : e)));
  const deleteMeeting = (id: string) =>
    setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>

        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>

            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {acceptedUpcoming.length}
                </h3>
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

      {/* Collaboration Requests (sent by this investor) */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
          </CardHeader>
          <CardBody>
            {sentRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentRequests.map(req => (
                  <CollaborationRequestCard
                    key={req.id}
                    request={req}
                    onScheduleMeeting={handleScheduleMeeting}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No collaboration requests yet.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>

          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No startups match your filters</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
