'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  from_user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  to_user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function ParentMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'sent'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/teacher/messages'); // Same endpoint, different role
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (filter) {
      case 'unread':
        return !message.is_read && message.to_user.role === 'parent';
      case 'sent':
        return message.from_user.role === 'parent';
      default:
        return true;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-600">
            Communicate with your children's teachers about their progress.
          </p>
        </div>
        <Link
          href="/parent/messages/new"
          className="btn-primary"
        >
          💬 New Message
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Messages', count: messages.length },
            { key: 'unread', label: 'Unread', count: messages.filter(m => !m.is_read && m.to_user.role === 'parent').length },
            { key: 'sent', label: 'Sent', count: messages.filter(m => m.from_user.role === 'parent').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  filter === tab.key
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages List */}
      {filteredMessages.length > 0 ? (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`card cursor-pointer transition-all hover:shadow-md ${
                !message.is_read && message.to_user.role === 'parent' ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {message.from_user.role === 'parent' 
                        ? message.to_user.firstName[0] + message.to_user.lastName[0]
                        : message.from_user.firstName[0] + message.from_user.lastName[0]
                      }
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {message.from_user.role === 'parent' 
                        ? `To: ${message.to_user.firstName} ${message.to_user.lastName}`
                        : `From: ${message.from_user.firstName} ${message.from_user.lastName}`
                      }
                    </p>
                    {message.student && (
                      <p className="text-sm text-gray-600">
                        About: {message.student.firstName} {message.student.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                  {!message.is_read && message.to_user.role === 'parent' && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
              <p className="text-gray-700 text-sm line-clamp-3">{message.content}</p>

              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  message.from_user.role === 'parent' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {message.from_user.role === 'parent' ? 'Sent' : 'Received'}
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Reply →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' 
              ? 'No messages yet' 
              : filter === 'unread'
              ? 'No unread messages'
              : 'No sent messages'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Start communicating with your children\'s teachers.'
              : filter === 'unread'
              ? 'All caught up! No new messages to read.'
              : 'You haven\'t sent any messages yet.'
            }
          </p>
          <Link
            href="/parent/messages/new"
            className="btn-primary inline-flex items-center"
          >
            💬 Send Your First Message
          </Link>
        </div>
      )}
    </div>
  );
}
