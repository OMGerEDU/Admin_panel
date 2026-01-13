/**
 * Audio utility for notifications
 */

// Base64 for a subtle "ping" notification sound
const NOTIFICATION_SOUND_B64 = 'data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEgAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRTU0UAAAAPAAADTGF2ZjYwLjMuMTAwAAAAAAAAAAAAAAD/+000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExhdmY2MC4zLjEwMAD/+000OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVW5pdGxlZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uNNBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGNoYW5uZWxfbGF5b3V0AHN0ZXJlMAD/+000OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGV2aWNlX25hbWUAQXBwbGUgTmV4dCBTZXNzaW9uAP/7TTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzYW1wbGVfcmF0ZQA0ODAwMAD/+000OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYml0X3JhdGUAMTI4MDAwAP/7TTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABidWZmZXJfc2l6ZQA0MDk2MAD/+000OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcXVhbGl0eQAwAP/7TTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2YnIAZWFjMwD/+000OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdXNlX3B0dAAwAP/7TTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiaW5hcnlfZmlsZQAwAP/7TTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzb3VyY2VfdHlwZQBmaWxlAP/7TTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzb3VyY2Vfa2V5AG5vdGlmaWNhdGlvbi5tcDM='

// A simpler fallback using a short oscillator beep if base64 fails
export const playNotificationSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.warn('Audio playback failed:', e);
    }
};
