import { ParticipantTrack } from "@/hooks/useRoomMedia";
import { Participant } from "@/hooks/useRoomSocket";
import { ParticipantTile } from "./ParticipantTile";

type Props = {
  participants: Participant[];
  tracks: ParticipantTrack[];
  raisedHands: Set<number>;
  localUserId?: number;
};

export function ParticipantGrid({ participants, tracks, raisedHands, localUserId }: Props) {
  // Helper to extract userId from LiveKit identity (e.g., "user_12")
  const getUserIdFromIdentity = (identity: string): number => {
    const match = identity.match(/^user_(\d+)/);
    return match ? parseInt(match[1], 10) : -1;
  };

  // Build grid items: one tile for each participant's video track,
  // or a default placeholder tile if no video track exists.
  const tiles: React.ReactNode[] = [];

  participants.forEach((p) => {
    const isLocal = p.userId === localUserId;

    // Filter tracks for this participant
    const userTracks = tracks.filter((t) => getUserIdFromIdentity(t.identity) === p.userId);
    const videoTracks = userTracks.filter((t) => t.kind === "video");
    const audioTrack = userTracks.find((t) => t.kind === "audio");

    // If there are no video tracks at all, render a placeholder tile
    if (videoTracks.length === 0) {
      tiles.push(
        <ParticipantTile
          key={`placeholder-${p.userId}`}
          name={p.name}
          isLocal={isLocal}
          handRaised={raisedHands.has(p.userId)}
          micMuted={!audioTrack}
        />
      );
    } else {
      // Render a tile for each video track (could be camera and screen share)
      videoTracks.forEach((vt, index) => {
        const isScreen = vt.track.source === "screen_share" || vt.track.name?.includes("screen");
        tiles.push(
          <ParticipantTile
            key={`video-${p.userId}-${index}`}
            name={p.name}
            isLocal={isLocal}
            videoTrack={vt.track}
            isScreenShare={isScreen}
            handRaised={raisedHands.has(p.userId)}
            micMuted={!audioTrack}
          />
        );
      });
    }
  });

  // Calculate premium CSS grid layout depending on the number of tiles
  let gridCols = "grid-cols-1";
  if (tiles.length === 2) {
    gridCols = "grid-cols-1 md:grid-cols-2";
  } else if (tiles.length >= 3 && tiles.length <= 4) {
    gridCols = "grid-cols-1 md:grid-cols-2";
  } else if (tiles.length > 4) {
    gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }

  return (
    <div className={`grid ${gridCols} gap-6 w-full h-full auto-rows-fr max-h-[80vh] overflow-y-auto pr-2`}>
      {tiles}
    </div>
  );
}
