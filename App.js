import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [gain, setGain] = useState(2.0);
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        requestPermissions();
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const requestPermissions = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status === 'granted') {
                setHasPermission(true);
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: false,
                    playThroughEarpieceAndroid: false,
                });
            } else {
                Alert.alert(
                    'Permission Denied',
                    'Microphone permission is required for voice amplification.'
                );
            }
        } catch (err) {
            console.error('Permission error:', err);
            Alert.alert('Error', 'Failed to request microphone permission.');
        }
    };

    const startRecording = async () => {
        if (!hasPermission) {
            Alert.alert('Permission Required', 'Please grant microphone permission.');
            return;
        }

        try {
            // Stop any playing sound first
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(newRecording);
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording.');
        }
    };

    const stopRecordingAndPlay = async () => {
        if (!recording) return;

        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            // Play the recorded audio with amplification
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false,
                playThroughEarpieceAndroid: false,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                {
                    shouldPlay: true,
                    volume: Math.min(gain / 5.0, 1.0), // Normalize gain to 0-1 range
                }
            );

            setSound(newSound);
            setIsPlaying(true);

            // When playback finishes, reset
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    newSound.unloadAsync();
                    setSound(null);

                    // Reset audio mode for recording
                    Audio.setAudioModeAsync({
                        allowsRecordingIOS: true,
                        playsInSilentModeIOS: true,
                        staysActiveInBackground: false,
                        shouldDuckAndroid: false,
                        playThroughEarpieceAndroid: false,
                    });
                }
            });
        } catch (error) {
            console.error('Failed to play recording:', error);
            Alert.alert('Error', 'Failed to play recording.');
            setIsPlaying(false);
        }
    };

    const getGainLabel = (gainValue) => {
        if (gainValue <= 1.5) return 'Low';
        if (gainValue <= 3.0) return 'Medium';
        return 'High';
    };

    const getGainColor = (gainValue) => {
        if (gainValue <= 1.5) return '#10b981';
        if (gainValue <= 3.0) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>🎤 Voice Amplifier</Text>
                    <Text style={styles.subtitle}>
                        Record & play back your amplified voice
                    </Text>
                </View>

                {/* Instructions Card */}
                <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsTitle}>📱 How to Use</Text>
                    <Text style={styles.instructionsText}>
                        1. Adjust amplification level below{'\n'}
                        2. Press and HOLD the big button to record{'\n'}
                        3. Speak your message while holding{'\n'}
                        4. RELEASE the button to stop and play amplified{'\n'}
                        5. Your amplified voice plays through speaker!
                    </Text>
                </View>

                {/* Volume Control */}
                <View style={styles.section}>
                    <View style={styles.controlHeader}>
                        <Text style={styles.label}>Volume Level</Text>
                        <View style={styles.valueContainer}>
                            <Text style={[styles.value, { color: getGainColor(gain) }]}>
                                {gain.toFixed(1)}x
                            </Text>
                            <Text style={styles.levelLabel}>{getGainLabel(gain)}</Text>
                        </View>
                    </View>

                    <Slider
                        style={styles.slider}
                        minimumValue={1.0}
                        maximumValue={5.0}
                        value={gain}
                        onValueChange={setGain}
                        minimumTrackTintColor={getGainColor(gain)}
                        maximumTrackTintColor="#334155"
                        thumbTintColor="#6366f1"
                        step={0.1}
                        disabled={isRecording || isPlaying}
                    />

                    <View style={styles.presets}>
                        <TouchableOpacity
                            style={styles.preset}
                            onPress={() => setGain(1.5)}
                            disabled={isRecording || isPlaying}>
                            <Text style={styles.presetText}>Low</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.preset}
                            onPress={() => setGain(2.5)}
                            disabled={isRecording || isPlaying}>
                            <Text style={styles.presetText}>Med</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.preset}
                            onPress={() => setGain(4.0)}
                            disabled={isRecording || isPlaying}>
                            <Text style={styles.presetText}>High</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Control Button */}
                <TouchableOpacity
                    style={[
                        styles.mainButton,
                        isRecording ? styles.mainButtonRecording : styles.mainButtonInactive,
                        isPlaying && styles.mainButtonPlaying,
                        !hasPermission && styles.mainButtonDisabled,
                    ]}
                    onPressIn={startRecording}
                    onPressOut={stopRecordingAndPlay}
                    disabled={!hasPermission || isPlaying}
                    activeOpacity={0.9}>
                    <Text style={styles.mainButtonText}>
                        {!hasPermission
                            ? 'Permission Required'
                            : isPlaying
                                ? '🔊 Playing Amplified...'
                                : isRecording
                                    ? '🎙️ Recording... (Release to Play)'
                                    : '⬇️ HOLD to Record & Speak'}
                    </Text>
                    {isRecording && (
                        <Text style={styles.recordingHint}>Release to play back amplified</Text>
                    )}
                </TouchableOpacity>

                {/* Status */}
                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusDot,
                        isRecording && styles.statusDotRecording,
                        isPlaying && styles.statusDotPlaying
                    ]} />
                    <Text style={styles.statusText}>
                        {isRecording
                            ? 'Recording your voice...'
                            : isPlaying
                                ? 'Playing amplified audio...'
                                : 'Ready - Hold button to record'}
                    </Text>
                </View>

                {/* Tips */}
                <View style={styles.warningCard}>
                    <Text style={styles.warningTitle}>💡 Tips</Text>
                    <Text style={styles.warningText}>
                        • Speak clearly while holding the button{'\n'}
                        • Keep phone close to your mouth when recording{'\n'}
                        • Point speaker toward listener during playback{'\n'}
                        • Start with low volume and increase if needed
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        padding: 24,
        gap: 24,
        paddingTop: 48,
    },
    header: {
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f1f5f9',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#cbd5e1',
        textAlign: 'center',
    },
    instructionsCard: {
        backgroundColor: '#1e293b',
        padding: 20,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#6366f1',
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6366f1',
        marginBottom: 12,
    },
    instructionsText: {
        fontSize: 15,
        color: '#f1f5f9',
        lineHeight: 24,
    },
    warningCard: {
        backgroundColor: '#1e293b',
        padding: 20,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
    },
    warningTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#10b981',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 15,
        color: '#f1f5f9',
        lineHeight: 24,
    },
    section: {
        backgroundColor: '#1e293b',
        padding: 24,
        borderRadius: 16,
        gap: 16,
    },
    controlHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: '#f1f5f9',
    },
    valueContainer: {
        alignItems: 'flex-end',
        gap: 4,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    levelLabel: {
        fontSize: 12,
        color: '#94a3b8',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    presets: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 8,
    },
    preset: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6366f1',
    },
    presetText: {
        fontSize: 16,
        color: '#6366f1',
        fontWeight: '600',
    },
    mainButton: {
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 160,
    },
    mainButtonInactive: {
        backgroundColor: '#6366f1',
    },
    mainButtonRecording: {
        backgroundColor: '#ef4444',
    },
    mainButtonPlaying: {
        backgroundColor: '#10b981',
    },
    mainButtonDisabled: {
        backgroundColor: '#334155',
        opacity: 0.5,
    },
    mainButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f1f5f9',
        textAlign: 'center',
    },
    recordingHint: {
        fontSize: 14,
        color: '#fecaca',
        marginTop: 8,
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#94a3b8',
    },
    statusDotRecording: {
        backgroundColor: '#ef4444',
    },
    statusDotPlaying: {
        backgroundColor: '#10b981',
    },
    statusText: {
        fontSize: 16,
        color: '#f1f5f9',
    },
});
