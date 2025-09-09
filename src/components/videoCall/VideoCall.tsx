import React, { useRef, useState } from "react";
import { Button } from "../ui/Button";

const VideoCall: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Start call (mock: just showing local camera)
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }

      setIsCallActive(true);
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
    }
  };

  // End call
  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    setIsCallActive(false);
  };

  // Toggle video
  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  // Screen share
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Screen share error:", err);
      }
    } else {
      endCall(); // for simplicity, stop everything
      setIsScreenSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-2xl shadow-lg">
      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-60 h-40 bg-black rounded-lg"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-60 h-40 bg-black rounded-lg"
        />
      </div>

      <div className="flex gap-2 mt-4">
        {!isCallActive ? (
          <Button variant="primary" onClick={startCall}>
            Start Call
          </Button>
        ) : (
          <>
            <Button variant="destructive" onClick={endCall}>
              End Call
            </Button>
            <Button variant="outline" onClick={toggleVideo}>
              {isVideoOn ? "Turn Video Off" : "Turn Video On"}
            </Button>
            <Button variant="outline" onClick={toggleAudio}>
              {isAudioOn ? "Mute" : "Unmute"}
            </Button>
            <Button variant="secondary" onClick={toggleScreenShare}>
              {isScreenSharing ? "Stop Share" : "Share Screen"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
