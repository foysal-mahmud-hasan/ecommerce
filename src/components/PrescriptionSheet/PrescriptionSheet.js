import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { submitPrescription } from '../../api/prescriptions';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { IconUpload } from '../Icons';
import { styles } from './PrescriptionSheet.styles';

export default function PrescriptionSheet() {
  const t = useTheme();
  const {
    prescriptionSheetOpen,
    closePrescriptionSheet,
    showToast,
    auth,
    tenant,
  } = useStore();

  const sheetRef = useRef(null);
  const [file, setFile] = useState(null); // { uri, mime }
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prescriptionSheetOpen) {
      // Pre-fill from auth if available.
      setName(auth?.user?.name || '');
      setPhone(auth?.phone || '');
      setAddress('');
      setFile(null);
      setError(null);
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [prescriptionSheetOpen, auth]);

  const onPickFile = useCallback(async () => {
    setError(null);
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: false,
      });
      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (!asset?.uri) return;
      setFile({ uri: asset.uri, mime: asset.mimeType || 'image/jpeg' });
    } catch (e) {
      setError(e.message || 'Could not open the image picker.');
    }
  }, []);

  const onSubmit = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      await submitPrescription({
        tenantId: tenant?.id,
        fileUri: file?.uri,
        fileMime: file?.mime,
        name,
        phone,
        address,
      });
      showToast('Prescription submitted');
      closePrescriptionSheet();
    } catch (e) {
      setError(e.message || 'Could not submit. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [tenant?.id, file, name, phone, address, showToast, closePrescriptionSheet]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    [],
  );

  const snapPoints = useMemo(() => ['85%'], []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={closePrescriptionSheet}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: t.ink4 }}
      backgroundStyle={{ backgroundColor: t.bg }}
      enablePanDownToClose
      keyboardBehavior="interactive"
    >
      <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: t.ink3, fontFamily: t.fonts.mono }]}>
          ORDER WITH PRESCRIPTION
        </Text>
        <Text style={[styles.title, { color: t.ink, fontFamily: t.fonts.display }]}>
          Upload prescription
        </Text>
        <Text style={[styles.body, { color: t.ink2, fontFamily: t.fonts.sans }]}>
          A pharmacist will review your image, confirm the medicines and dosage,
          and message you before dispatching.
        </Text>

        {file ? (
          <View style={[styles.preview, { backgroundColor: t.surfaceDeep }]}>
            <Image
              source={{ uri: file.uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
            />
            <Pressable
              onPress={() => setFile(null)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.55)',
              }}
            >
              <Text style={{ color: '#fff', fontFamily: t.fonts.sansSemiBold, fontSize: 11 }}>
                Replace
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={onPickFile}
            style={({ pressed }) => [
              styles.uploadBox,
              { borderColor: t.line, backgroundColor: t.surface, opacity: pressed ? 0.92 : 1 },
            ]}
            accessibilityRole="button"
          >
            <IconUpload color={t.ink} size={22} />
            <Text style={[styles.uploadHint, { color: t.ink, fontFamily: t.fonts.sansSemiBold }]}>
              Tap to choose a photo
            </Text>
            <Text style={[styles.uploadHint, { color: t.ink3, fontFamily: t.fonts.sans }]}>
              JPG or PNG · up to 10 MB
            </Text>
          </Pressable>
        )}

        <Text style={[styles.fieldLabel, { color: t.ink3 }]}>FULL NAME</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={t.ink3}
          style={[styles.input, { backgroundColor: t.surface, borderColor: t.line, color: t.ink }]}
        />

        <Text style={[styles.fieldLabel, { color: t.ink3 }]}>MOBILE</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="01XXXXXXXXX"
          placeholderTextColor={t.ink3}
          keyboardType="phone-pad"
          style={[styles.input, { backgroundColor: t.surface, borderColor: t.line, color: t.ink }]}
        />

        <Text style={[styles.fieldLabel, { color: t.ink3 }]}>DELIVERY ADDRESS</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="House, road, area, city"
          placeholderTextColor={t.ink3}
          multiline
          style={[
            styles.input,
            {
              height: 70,
              paddingTop: 12,
              backgroundColor: t.surface,
              borderColor: t.line,
              color: t.ink,
            },
          ]}
        />

        <Pressable
          onPress={onSubmit}
          disabled={busy}
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: busy ? t.ink3 : t.ink, opacity: pressed ? 0.9 : 1 },
          ]}
          accessibilityRole="button"
        >
          <Text style={[styles.submitText, { color: t.bg }]}>
            {busy ? 'Submitting…' : 'Submit prescription'}
          </Text>
        </Pressable>

        {error ? (
          <Text style={[styles.errorText, { color: t.sale }]}>{error}</Text>
        ) : null}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
