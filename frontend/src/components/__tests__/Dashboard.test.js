import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

// Mock the API
jest.mock('../../api/axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: [
      {
        _id: '1',
        from: 'WALLET_123',
        to: 'WALLET_456',
        amount: 100,
        timestamp: new Date().toISOString(),
        txid: 'tx123'
      }
    ]
  }))
}));

const MockDashboard = () => (
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <Dashboard />
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  it('renders dashboard elements', async () => {
    render(<MockDashboard />);
    
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByText('Send Money')).toBeInTheDocument();
    expect(screen.getByText('Receive Money')).toBeInTheDocument();
    expect(screen.getByText('Scan & Pay')).toBeInTheDocument();
    expect(screen.getByText('WebRTC')).toBeInTheDocument();
  });

  it('displays transaction history', async () => {
    render(<MockDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    });
  });

  it('shows quick action buttons', () => {
    render(<MockDashboard />);
    
    const sendButton = screen.getByText('Send Money');
    const receiveButton = screen.getByText('Receive Money');
    const scanButton = screen.getByText('Scan & Pay');
    const webrtcButton = screen.getByText('WebRTC');
    
    expect(sendButton).toBeInTheDocument();
    expect(receiveButton).toBeInTheDocument();
    expect(scanButton).toBeInTheDocument();
    expect(webrtcButton).toBeInTheDocument();
  });
});

