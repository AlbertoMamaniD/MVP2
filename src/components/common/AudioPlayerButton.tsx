"use client";

import React, { useState, useEffect } from "react";
import { speakMessage, stopSpeaking } from "@/lib/utils/audioSpeech";
import { VolumeIcon, VolumeStopIcon } from "@/components/common/Icons";
import styles from "./AudioPlayerButton.module.css";

interface AudioPlayerButtonProps {
  messageToRead: string;
  label?: string;
  variant?: "primary" | "subtle" | "banner";
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  messageToRead,
  label = "Escuchar en Audio (Voz Clara)",
  variant = "subtle",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!supported) return null;

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      const ok = speakMessage(
        messageToRead,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
      if (!ok) setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${isPlaying ? styles.playing : ""}`}
      onClick={handleToggleAudio}
      title={isPlaying ? "Detener audio" : "Escuchar mensaje leído en voz alta"}
      aria-label={label}
    >
      <span className={styles.icon}>
        {isPlaying ? <VolumeStopIcon size={16} /> : <VolumeIcon size={16} />}
      </span>
      <span className={styles.label}>{isPlaying ? "Pausar Audio" : label}</span>
      {isPlaying && (
        <span className={styles.wave}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      )}
    </button>
  );
};
