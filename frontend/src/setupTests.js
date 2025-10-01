// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock WebRTC APIs
global.RTCPeerConnection = jest.fn(() => ({
  createDataChannel: jest.fn(),
  addTrack: jest.fn(),
  close: jest.fn(),
  onicecandidate: null,
  ontrack: null,
  ondatachannel: null
}));

global.RTCDataChannel = jest.fn(() => ({
  send: jest.fn(),
  close: jest.fn(),
  onopen: null,
  onmessage: null,
  readyState: 'open'
}));

// Mock getUserMedia
global.navigator.mediaDevices = {
  getUserMedia: jest.fn(() => Promise.resolve({
    getTracks: () => []
  }))
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

