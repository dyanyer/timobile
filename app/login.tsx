import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient"; // Import the gradient component
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password, companyCode);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Login failed", err.message || "Please try again.");
    }
  };

  return (
    <LinearGradient
      // Apply gradient from top to bottom
      colors={["#4b6b6c", "#074857"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-6">
          {/* Company Logo */}
          <Image
            source={require("@/assets/Timora_Logo.png")}
            className="w-24 h-24 mb-6"
            resizeMode="contain"
          />

          {/* Card container */}
          <View className="w-full bg-white p-6 rounded-2xl shadow-xl">
            <Text className="text-3xl font-extrabold text-[#074857] text-center mb-2">
              Welcome Back
            </Text>
            <Text className="text-center text-[#4b6b6c] mb-6">
              Login to manage your payroll
            </Text>

            {/* Company Code */}
            <TextInput
              placeholder="Company Code"
              className="w-full border border-[#80a6a7] rounded-lg p-3 mb-4 bg-[#f3f3f3]"
              value={companyCode}
              onChangeText={setCompanyCode}
              autoCapitalize="characters"
              placeholderTextColor="#4b6b6c"
            />

            {/* Email */}
            <TextInput
              placeholder="Email"
              className="w-full border border-[#80a6a7] rounded-lg p-3 mb-4 bg-[#f3f3f3]"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#4b6b6c"
            />

            {/* Password */}
            <TextInput
              placeholder="Password"
              className="w-full border border-[#80a6a7] rounded-lg p-3 mb-6 bg-[#f3f3f3]"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#4b6b6c"
            />

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-[#074857] w-full p-4 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text className="text-[#80a6a7] text-sm mt-6">
            © {new Date().getFullYear()} YourCompany. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
