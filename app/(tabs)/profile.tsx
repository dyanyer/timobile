import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // clears token from storage/context
      router.replace("/login"); // go back to login screen
    } catch (err) {
      Alert.alert("Logout failed", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f3f3f3]">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-2xl font-bold text-[#074857] mb-2">
          {user?.name || "Employee"}
        </Text>
        <Text className="text-gray-500 mb-6">{user?.email}</Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
