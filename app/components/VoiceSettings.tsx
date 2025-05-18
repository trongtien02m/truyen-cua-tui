import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoiceSettingsProps {
  visible: boolean;
  onClose: () => void;
  pitch: number;
  rate: number;
  onPitchChange: (value: number) => void;
  onRateChange: (value: number) => void;
  voice: string | null;
  onVoiceChange: (voice: string) => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  visible,
  onClose,
  pitch,
  rate,
  onPitchChange,
  onRateChange,
  voice,
  onVoiceChange,
}) => {
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [isFetchingVoices, setIsFetchingVoices] = useState(true); // Theo dõi trạng thái tải

  useEffect(() => {
    let isMounted = true;

    const fetchVoices = async () => {
      let voices: Speech.Voice[] = [];

      try {
        // Đánh thức TTS bằng 1 câu nói ngắn
        Speech.speak('', {
          rate: 0.5,
          pitch: 1,
          voice: voice ?? undefined,
          onDone: () => {},
        });
      } catch {
        // Không sao nếu lỗi, chỉ để thử khởi tạo TTS
      }

      while (voices.length === 0 && isMounted) {
        try {
          voices = await Speech.getAvailableVoicesAsync();

          if (voices.length === 0 && isMounted) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error('Error fetching voices', error);
          break;
        }
      }

      if (!isMounted) return;

      setIsFetchingVoices(false);

      const vietnameseVoices = voices.filter((voice) =>
        voice.language.startsWith('vi')
      );

      setVoices(vietnameseVoices);
    };

    fetchVoices();

    return () => {
      isMounted = false; // Ngăn setState sau khi unmount
    };
  }, []);

  if (isFetchingVoices) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải danh sách giọng đọc...</Text>
      </View>
    );
  }

  if (voices.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Không tìm thấy giọng đọc. Vui lòng kiểm tra cài đặt TTS trên thiết bị.
        </Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tùy chỉnh giọng đọc</Text>
          <Text style={styles.modalLabel}>Tông giọng: {pitch.toFixed(1)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            step={0.1}
            value={pitch}
            onValueChange={(value) => onPitchChange(Number(value.toFixed(1)))}
          />
          <Text style={styles.modalLabel}>Tốc độ đọc: {rate.toFixed(1)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            step={0.1}
            value={rate}
            onValueChange={(value) => onRateChange(Number(value.toFixed(1)))}
          />
          <Text style={styles.modalLabel}>Chọn giọng đọc:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={voice ?? undefined}
              onValueChange={onVoiceChange}
              style={styles.picker}
            >
              {voices.map((voice) => (
                <Picker.Item
                  key={voice.name}
                  label={voice.name}
                  value={voice.identifier}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VoiceSettings;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  pickerContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
