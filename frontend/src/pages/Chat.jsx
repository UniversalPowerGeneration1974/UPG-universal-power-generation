import React, { useState, useEffect, useRef } from 'react';
import api from '../config/api';
import './Chat.css';

function Chat({ currentUser, onUnreadUpdate }) {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastMessageCount, setLastMessageCount] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadContacts();
    const interval = setInterval(loadContacts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadMessages();
      // Clear unread for this contact when viewing it
      setUnreadMessages(prev => ({
        ...prev,
        [selectedContact.id]: 0
      }));
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update total unread count in parent
    const totalUnread = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);
    if (onUnreadUpdate) {
      onUnreadUpdate(totalUnread);
    }
  }, [unreadMessages, onUnreadUpdate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadContacts = async () => {
    try {
      const response = await api.get('/users');
      const filteredContacts = response.data.filter(user => user.id !== currentUser.id);
      setContacts(filteredContacts);
      
      // Only check for new messages when not viewing chat
      if (!selectedContact && filteredContacts.length > 0) {
        filteredContacts.forEach(async (contact) => {
          try {
            const msgResponse = await api.get(`/messages/${contact.id}`);
            const messages = msgResponse.data;
            const incomingMessages = messages.filter(msg => msg.sender_id === contact.id);
            const incomingCount = incomingMessages.length;
            
            // Get last known count for this contact
            const previousCount = lastMessageCount[contact.id] || 0;
            
            // Only increment unread if there are new messages
            if (incomingCount > previousCount) {
              const newMessages = incomingCount - previousCount;
              setUnreadMessages(prev => ({
                ...prev,
                [contact.id]: (prev[contact.id] || 0) + newMessages
              }));
            }
            
            // Update last message count
            setLastMessageCount(prev => ({
              ...prev,
              [contact.id]: incomingCount
            }));
          } catch (err) {
            console.error('Failed to load messages for contact:', contact.id);
          }
        });
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const loadMessages = async () => {
    if (!selectedContact) return;

    try {
      const response = await api.get(`/messages/${selectedContact.id}`);
      const newMessages = response.data;
      
      // Update last message count for this contact
      const incomingMessages = newMessages.filter(msg => msg.sender_id === selectedContact.id);
      setLastMessageCount(prev => ({
        ...prev,
        [selectedContact.id]: incomingMessages.length
      }));
      
      setMessages(newMessages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedContact) return;

    setLoading(true);
    try {
      const response = await api.post('/messages', {
        receiver_id: selectedContact.id,
        message: messageInput.trim()
      });

      if (response.data.success) {
        setMessageInput('');
        await loadMessages();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    (contact.fullname?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (contact.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>Contacts</h3>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="contacts-list">
            {filteredContacts.map(contact => (
              <li
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <strong>{contact.fullname || contact.username}</strong>
                <small>@{contact.username}</small>
              </li>
            ))}
          </ul>
          {filteredContacts.length === 0 && (
            <p className="no-contacts">{searchQuery ? 'No users found' : 'No other users available'}</p>
          )}
        </div>

        <div className="chat-main">
          {selectedContact ? (
            <>
              <div className="chat-header">
                <h3>{selectedContact.fullname || selectedContact.username}</h3>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <p className="no-messages">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}
                    >
                      {msg.message}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                />
                <button type="submit" className="send-btn" disabled={loading || !messageInput.trim()}>
                  {loading ? '...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <p>Select a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
