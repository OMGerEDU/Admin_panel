import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, Square, Trash2, Play, Pause, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VoiceRecorder({ onRecordingComplete, onClear }) {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioPlayerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                onRecordingComplete(blob, 'voice_message.webm');
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please ensure you have given permission.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const handleClear = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        onClear();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlayback = () => {
        if (!audioPlayerRef.current) return;

        if (isPlaying) {
            audioPlayerRef.current.pause();
        } else {
            audioPlayerRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                    {isRecording ? t('recorder.recording', 'Recording...') :
                        audioBlob ? t('recorder.preview', 'Voice Preview') :
                            t('recorder.title', 'Voice Message')}
                </span>
                {(isRecording || audioBlob) && (
                    <span className="text-sm font-mono bg-background px-2 py-0.5 rounded border">
                        {formatTime(recordingTime || (audioPlayerRef.current?.duration ? Math.round(audioPlayerRef.current.duration) : 0))}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {!audioBlob ? (
                    !isRecording ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 border-primary/20 hover:bg-primary/10"
                            onClick={startRecording}
                        >
                            <Mic className="h-4 w-4 text-red-500" />
                            {t('recorder.start', 'Record Voice')}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full gap-2 animate-pulse"
                            onClick={stopRecording}
                        >
                            <Square className="h-4 w-4 fill-current" />
                            {t('recorder.stop', 'Stop Recording')}
                        </Button>
                    )
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={togglePlayback}
                            className="shrink-0"
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>

                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden relative">
                            <div
                                className="absolute inset-0 bg-primary transition-all duration-100"
                                style={{ width: `${(audioPlayerRef.current?.currentTime / audioPlayerRef.current?.duration) * 100 || 0}%` }}
                            ></div>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {audioUrl && (
                <audio
                    ref={audioPlayerRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onTimeUpdate={() => setRecordingTime(Math.round(audioPlayerRef.current.currentTime))}
                    className="hidden"
                />
            )}
        </div>
    );
}
