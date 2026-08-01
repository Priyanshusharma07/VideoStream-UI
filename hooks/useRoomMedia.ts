import { useEffect, useRef, useState, useCallback } from 'react';

type Props = {
  url: string;
  token: string;
  enabled: boolean;
};

export type ParticipantTrack = {
  identity: string;
  isLocal: boolean;
  track: any;
  kind: 'video' | 'audio';
};

export function useRoomMedia({ url, token, enabled }: Props) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [tracks, setTracks] = useState<ParticipantTrack[]>([]);
  const roomRef = useRef<any>(null);

  const updateTracks = useCallback(() => {
    if (!roomRef.current) return;
    const room = roomRef.current;
    const list: ParticipantTrack[] = [];

    // Local participant
    room.localParticipant.trackPublications.forEach((pub: any) => {
      if (pub.track) {
        list.push({
          identity: room.localParticipant.identity,
          isLocal: true,
          track: pub.track,
          kind: pub.track.kind,
        });
      }
    });

    // Remote participants
    room.remoteParticipants.forEach((p: any) => {
      p.trackPublications.forEach((pub: any) => {
        if (pub.track && pub.isSubscribed) {
          list.push({
            identity: p.identity,
            isLocal: false,
            track: pub.track,
            kind: pub.track.kind,
          });
        }
      });
    });

    setTracks(list);
  }, []);

  const toggleCamera = useCallback(async () => {
    if (!roomRef.current) return;
    try {
      const room = roomRef.current;
      const enabledState = !isCameraEnabled;
      await room.localParticipant.setCameraEnabled(enabledState);
      setIsCameraEnabled(enabledState);
      updateTracks();
    } catch (e: any) {
      console.error('Failed to toggle camera', e);
    }
  }, [isCameraEnabled, updateTracks]);

  const toggleMicrophone = useCallback(async () => {
    if (!roomRef.current) return;
    try {
      const room = roomRef.current;
      const enabledState = !isMicrophoneEnabled;
      await room.localParticipant.setMicrophoneEnabled(enabledState);
      setIsMicrophoneEnabled(enabledState);
      updateTracks();
    } catch (e: any) {
      console.error('Failed to toggle microphone', e);
    }
  }, [isMicrophoneEnabled, updateTracks]);

  const toggleScreenShare = useCallback(async () => {
    if (!roomRef.current) return;
    try {
      const room = roomRef.current;
      const enabledState = !isScreenShareEnabled;
      await room.localParticipant.setScreenShareEnabled(enabledState);
      setIsScreenShareEnabled(enabledState);
      updateTracks();
    } catch (e: any) {
      console.error('Failed to toggle screen share', e);
    }
  }, [isScreenShareEnabled, updateTracks]);

  useEffect(() => {
    if (!enabled || !token || !url) {
      return;
    }

    let cancelled = false;

    async function initLiveKit() {
      try {
        const { Room, RoomEvent } = await import('livekit-client');
        const room = new Room({
          publishDefaults: {
            videoCodec: 'vp8',
          },
        });
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, () => {
          if (cancelled) return;
          updateTracks();
        });

        room.on(RoomEvent.TrackUnsubscribed, () => {
          if (cancelled) return;
          updateTracks();
        });

        room.on(RoomEvent.ParticipantConnected, () => {
          if (cancelled) return;
          updateTracks();
        });

        room.on(RoomEvent.ParticipantDisconnected, () => {
          if (cancelled) return;
          updateTracks();
        });

        room.on(RoomEvent.LocalTrackPublished, () => {
          if (cancelled) return;
          updateTracks();
        });

        room.on(RoomEvent.LocalTrackUnpublished, () => {
          if (cancelled) return;
          updateTracks();
        });

        await room.connect(url, token);
        if (cancelled) return;

        setStatus('connected');
        updateTracks();
      } catch (err: any) {
        if (cancelled) return;
        console.error('LiveKit connection error:', err);
        setStatus('failed');
        setErrorMsg(err.message || 'Connection failed');
      }
    }

    initLiveKit();

    return () => {
      cancelled = true;
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [url, token, enabled, updateTracks]);

  return {
    status,
    errorMsg,
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenShareEnabled,
    tracks,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
  };
}
