'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  _id: string;
  fromUser: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  toUser: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  student?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function TeacherMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'sent'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/teacher/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.map((msg: any) => ({
          _id: msg.id,
          fromUser: {
            _id: msg.from_user.id,
            firstName: msg.from_user.firstName,
            lastName: msg.from_user.lastName,
            role: msg.from_user.role
          },
          toUser: {
            _id: msg.to_user.id,
            firstName: msg.to_user.firstName,
            lastName: msg.to_user.lastName,
            role: msg.to_user.role
          },
          student: msg.student ? {
            _id: msg.student.id,
            firstName: msg.student.firstName,
            lastName: msg.student.lastName
          } : undefined,
          subject: msg.subject,
          content: msg.content,
          isRead: msg.is_read,
          createdAt: msg.created_at
        })));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (filter) {
      case 'unread':
        return !message.isRead;
      case 'sent':
        return message.fromUser.role === 'teacher';
      default:
        return true;
    }
  });

  const markAsRead = async (messageId: string) => {
    try {
      // TODO: API call to mark message as read
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const MessageCard = ({ message }: { message: Message }) => {
    const isReceived = message.toUser.role === 'teacher';
    
    return (
      <div
        className={`card cursor-pointer transition-all hover:shadow-md ${
          !message.isRead && isReceived ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
        }`}
        onClick={() => isReceived && !message.isRead && markAsRead(message._id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {isReceived 
                  ? message.fromUser.firstName[0] + message.fromUser.lastName[0]
                  : message.toUser.firstName[0] + message.toUser.lastName[0]
                }
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isReceived 
                  ? `${message.fromUser.firstName} ${message.fromUser.lastName}`
                  : `To: ${message.toUser.firstName} ${message.toUser.lastName}`
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
              {new Date(message.createdAt).toLocaleDateString()}
            </p>
            {!message.isRead && isReceived && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">{message.content}</p>

        <div className="mt-4 flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${
            isReceived 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isReceived ? 'Received' : 'Sent'}
          </span>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-600">
            Communicate with parents about student progress and activities.
          </p>
        </div>
        <Link
          href="/teacher/messages/new"
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
            { key: 'unread', label: 'Unread', count: messages.filter(m => !m.isRead && m.toUser.role === 'teacher').length },
            { key: 'sent', label: 'Sent', count: messages.filter(m => m.fromUser.role === 'teacher').length },
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
            <MessageCard key={message._id} message={message} />
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
              ? 'Start communicating with parents about student progress.'
              : filter === 'unread'
              ? 'All caught up! No new messages to read.'
              : 'You haven\'t sent any messages yet.'
            }
          </p>
          <Link
            href="/teacher/messages/new"
            className="btn-primary inline-flex items-center"
          >
            💬 Send Your First Message
          </Link>
        </div>
      )}
    </div>
  );
}
