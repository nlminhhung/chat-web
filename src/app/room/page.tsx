'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const holder_room = 'quickstart-room';
  

  const [roomInstance] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("username") ?? 'Guest';
  const room = urlParams.get("groupId") ?? holder_room;
  const userId = urlParams.get("userId") ?? '123';
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/token?room=${room}&username=${name}&userId=${userId}`);
        const data = await resp.json();

        if (!resp.ok) {
          setHasError(true);
          return;
        }

        if (!mounted) return;

        if (data.token) {
          await roomInstance.connect(`${process.env.NEXT_PUBLIC_LIVEKIT_URL}`, data.token);
        }
      } catch (e) {
        console.error(e);
        toast.error('Unexpected error connecting to LiveKit');
        setHasError(true);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-red-600">
        <div>
          <h1 className="text-3xl font-bold">Access Denied or Error</h1>
          <p className="mt-4">You are not allowed to join this call or something went wrong.</p>
        </div>
      </div>
    );
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh' }}>
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar controls={{
                      microphone: true,
                      camera: true,
                      screenShare: true,
                      chat: false,
                      leave: false, }}/>
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
