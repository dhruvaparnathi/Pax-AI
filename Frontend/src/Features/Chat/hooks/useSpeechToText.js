import { useState, useEffect, useRef } from "react";

export const useSpeechToText = (onTranscript) => {
  const [isListening, setIsListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState(null);
  const recognitionRef = useRef(null);

  const onTranscriptRef = useRef(onTranscript);
  const targetRef = useRef(listeningTarget);

  // Keep references in sync with state updates without re-triggering effects
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    targetRef.current = listeningTarget;
  }, [listeningTarget]);

  const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const isSpeechSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSpeechSupported) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      if (onTranscriptRef.current && targetRef.current) {
        onTranscriptRef.current(transcript, targetRef.current);
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setListeningTarget(null);
    };

    rec.onerror = (event) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
      setListeningTarget(null);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSpeechSupported]);

  const startListening = (target) => {
    if (!isSpeechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    }

    setListeningTarget(target);
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
      setListeningTarget(null);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setListeningTarget(null);
  };

  return {
    isListening,
    isSpeechSupported,
    listeningTarget,
    startListening,
    stopListening
  };
};
