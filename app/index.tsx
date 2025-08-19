import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Handle the navigation logic after loading finishes
    if (!loading) {
      if (user) {
        // If the user is logged in, navigate to the home tab
        router.replace("/(tabs)/home");
      } else {
        // If there's no user (i.e., not logged in), navigate to the login screen
        router.replace("/login");
      }
    }
  }, [user, loading, router]); // Ensure to include router in the dependency array

  // Show loading spinner while checking auth status
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}
