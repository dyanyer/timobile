import axiosClient from "@/services/axios"; // Ensure this is correct
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

type ClockInButtonProps = {
  isClockIn: boolean;
  onClockInChange: (status: boolean) => void;
};

export default function ClockInButton({
  isClockIn,
  onClockInChange,
}: ClockInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [lateReason, setLateReason] = useState<string | null>(null); // Optional late reason state

  // Function to request permissions and capture photo and location
  const getPhotoAndLocation = async () => {
    // Request the necessary permissions
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (locationStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your location and camera."
      );
      return null; // If permissions are denied, return null
    }

    // Capture a photo using the camera with the option to force JPEG format
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Automatically converts the image to base64
      exif: false, // Prevents EXIF data from being added, if unnecessary
    });

    if (result.canceled) {
      return null; // If the user cancels, return null
    }

    const photoUri = result.assets?.[0]?.uri; // Get the URI from the result
    if (!photoUri) {
      Alert.alert("Error", "No photo captured.");
      return null;
    }

    // Get the current location
    let userLocation = await Location.getCurrentPositionAsync({});
    if (!userLocation) {
      Alert.alert("Error", "Unable to get location.");
      return null;
    }

    return { photoUri, userLocation }; // Return both photo URI and location object
  };

  // Convert photo URI to Blob using fetch API
  const convertUriToBlob = async (uri: string) => {
    try {
      // Fetch the image from the URI and convert it into a Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      return blob;
    } catch (error) {
      console.error("Error converting URI to Blob", error);
      return null;
    }
  };

  // Handle clock-in or clock-out action
  const handleClockInOut = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    // Get both the photo and location
    const data = await getPhotoAndLocation();
    if (!data) {
      setLoading(false);
      return; // If data is null (either permissions were denied or user canceled), stop execution
    }

    const { photoUri, userLocation } = data; // Destructure the returned data

    // Convert the photo URI to Blob
    const photoBlob = await convertUriToBlob(photoUri);
    if (!photoBlob) {
      Alert.alert("Error", "Failed to convert photo to Blob.");
      setLoading(false);
      return;
    }

    // Use FormData to send the photo as a file (multipart/form-data)
    // Build FormData
    const formData = new FormData();
    formData.append(
      "time_in_latitude",
      userLocation.coords.latitude.toString()
    );
    formData.append(
      "time_in_longitude",
      userLocation.coords.longitude.toString()
    );

    // ✅ Correct way: send the file object, not a Blob
    formData.append("time_in_photo", {
      uri: photoUri,
      name: "clockin.jpg",
      type: "image/jpeg",
    } as any);

    // Optionally add late reason
    if (lateReason && isClockIn) {
      formData.append("late_status_reason", lateReason);
    }

    try {
      // Send the request with FormData
      const response = await axiosClient.post(
        "/attendance/clock-in",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onClockInChange(true); // Update the clock-in status
      Alert.alert("Success", response.data.message); // Show success message
    } catch (error) {
      console.error("Error clocking in:", error);
      Alert.alert("Error", "Failed to clock in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClockInOut}
      className={`mt-5 py-4 rounded-2xl shadow-lg flex-row justify-center items-center ${
        isClockIn ? "bg-[#0C7E91]" : "bg-[#0F8EA4]"
      }`}
      activeOpacity={0.9}
      disabled={loading} // Disable button while loading
    >
      <Ionicons
        name={isClockIn ? "exit-outline" : "enter-outline"}
        size={22}
        color="white"
        style={{ marginRight: 8 }}
      />
      <Text className="text-lg font-bold text-white">
        {isClockIn ? "Clock Out" : "Clock In"}
      </Text>
    </TouchableOpacity>
  );
}
