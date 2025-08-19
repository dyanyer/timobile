// components/buttons/clockOut.tsx
import axiosClient from "@/services/axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity } from "react-native";

interface ClockOutButtonProps {
  shiftId?: number | null;
  onClockOutSuccess: (time: string) => void;
}

export default function ClockOutButton({
  shiftId,
  onClockOutSuccess,
}: ClockOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClockOut = async () => {
    try {
      // 1️⃣ Camera permission
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
        return;
      }

      // 2️⃣ Location permission
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      // 3️⃣ Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result.canceled) return;

      setLoading(true);

      // 4️⃣ Get location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 5️⃣ Build FormData
      const formData = new FormData();
      if (shiftId) formData.append("shift_id", String(shiftId));

      const photo = result.assets[0];
      formData.append("time_out_photo", {
        uri: photo.uri,
        name: "clockout.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("time_out_latitude", String(latitude));
      formData.append("time_out_longitude", String(longitude));

      // 6️⃣ Send request
      const response = await axiosClient.post(
        "/attendance/clock-out",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const clockOutTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      onClockOutSuccess(clockOutTime);
      Alert.alert(
        "Success",
        response.data.message || "Clocked out successfully"
      );
    } catch (error: any) {
      Alert.alert("Clock Out Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClockOut}
      disabled={loading}
      className="bg-red-600 p-4 rounded-2xl mt-5 items-center"
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white font-bold text-lg">Clock Out</Text>
      )}
    </TouchableOpacity>
  );
}
