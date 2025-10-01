import { useState, useRef, useCallback } from 'react';

export const useWebRTC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const createPeerConnection = useCallback(() => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send candidate to remote peer
        console.log('ICE candidate:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      setDataChannel(channel);
      
      channel.onmessage = (event) => {
        console.log('Received data:', event.data);
        // Handle incoming data (e.g., payment confirmations)
      };
    };

    setPeerConnection(pc);
    return pc;
  }, []);

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      if (peerConnection) {
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
      }

      return stream;
    } catch (err) {
      setError('Failed to access camera/microphone');
      throw err;
    }
  }, [peerConnection]);

  const createDataChannel = useCallback(() => {
    if (peerConnection) {
      const channel = peerConnection.createDataChannel('payment', {
        ordered: true
      });
      
      channel.onopen = () => {
        console.log('Data channel opened');
        setDataChannel(channel);
      };

      channel.onmessage = (event) => {
        console.log('Received payment data:', event.data);
        // Handle payment confirmations
      };

      return channel;
    }
  }, [peerConnection]);

  const sendPaymentData = useCallback((paymentData) => {
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(paymentData));
    } else {
      console.error('Data channel not ready');
    }
  }, [dataChannel]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const pc = createPeerConnection();
      await startLocalStream();
      createDataChannel();
      setIsConnected(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, [createPeerConnection, startLocalStream, createDataChannel]);

  const disconnect = useCallback(() => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    
    if (dataChannel) {
      dataChannel.close();
      setDataChannel(null);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    setIsConnected(false);
    setError(null);
  }, [peerConnection, dataChannel]);

  return {
    isConnected,
    isConnecting,
    error,
    peerConnection,
    dataChannel,
    localVideoRef,
    remoteVideoRef,
    connect,
    disconnect,
    sendPaymentData
  };
};


