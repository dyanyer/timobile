import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isClockIn, setIsClockIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    setIsMounted(true);

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      setIsMounted(false);
      clearInterval(timer);
    };
  }, []);

  const quickActions = [
    {
      label: "Payslip",
      icon: "cash-outline",
      bgColor: "bg-[#085D6C]",
      shadowColor: "shadow-[#085D6C]/30",
    },
    {
      label: "Calendar",
      icon: "calendar-outline",
      bgColor: "bg-[#0A6D7F]",
      shadowColor: "shadow-[#0A6D7F]/30",
    },
    {
      label: "Shift",
      icon: "time-outline",
      bgColor: "bg-[#0C7E91]",
      shadowColor: "shadow-[#0C7E91]/30",
    },
    {
      label: "Overtime",
      icon: "alarm-outline",
      bgColor: "bg-[#0F8EA4]",
      shadowColor: "shadow-[#0F8EA4]/30",
    },
    {
      label: "Leave",
      icon: "airplane-outline",
      bgColor: "bg-[#1A9FB8]",
      shadowColor: "shadow-[#1A9FB8]/30",
    },
    {
      label: "Attendance",
      icon: "checkmark-done-outline",
      bgColor: "bg-[#085D6C]",
      shadowColor: "shadow-[#085D6C]/30",
    },
    {
      label: "Holiday",
      icon: "calendar-clear-outline",
      bgColor: "bg-[#0A6D7F]",
      shadowColor: "shadow-[#0A6D7F]/30",
    },
    {
      label: "Assets",
      icon: "cube-outline",
      bgColor: "bg-[#0C7E91]",
      shadowColor: "shadow-[#0C7E91]/30",
    },
  ];

  const handleActionPress = (item: any) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClockInOut = () => {
    setIsClockIn(!isClockIn);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (!isMounted) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#06282e] p-2">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-8 m-6 rounded-xl bg-[#21a1a1] p">
          <Text>Uer Name</Text>
        </View>
        {/* Enhanced Quick Actions Grid */}
        <View className="px-6 mb-8">
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row flex-wrap justify-between">
              {quickActions.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleActionPress(item)}
                  className="items-center mb-5"
                  style={{ width: (width - 88) / 4 - 12 }}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    className={`${item.bgColor} w-16 h-16 rounded-2xl items-center justify-center mb-3 shadow-lg ${item.shadowColor}`}
                    style={{ transform: [{ scale: scaleAnim }] }}
                  >
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={32}
                      color="white"
                    />
                  </Animated.View>
                  <Text className="text-xs text-center text-[#053E46] font-semibold leading-4">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Enhanced Attendance Section */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-[#053E46] mb-5">
            Attendance
          </Text>

          {/* Status Indicator */}
          <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
            <View className="flex-row items-center mb-4">
              <View
                className={`w-3 h-3 rounded-full mr-2 ${
                  isClockIn ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <Text className="text-base font-semibold text-[#053E46]">
                {isClockIn ? "Currently Clocked In" : "Currently Clocked Out"}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1 font-medium">
                    Clock In
                  </Text>
                </View>
                <Text className="text-3xl font-extrabold text-[#053E46]">
                  {isClockIn ? "09:00" : "--:--"}
                </Text>
              </View>

              <View className="flex-1 items-end">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="exit-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1 font-medium">
                    Clock Out
                  </Text>
                </View>
                <Text className="text-3xl font-extrabold text-[#053E46]">
                  {isClockIn ? formatTime(currentTime) : "--:--"}
                </Text>
              </View>
            </View>
          </View>

          {/* Enhanced Clock In/Out Button */}
          <TouchableOpacity
            onPress={handleClockInOut}
            className={`py-4 rounded-2xl shadow-lg active:scale-95 ${
              isClockIn
                ? "bg-[#0A6D7F] shadow-[#0A6D7F]/30"
                : "bg-[#085D6C] shadow-[#085D6C]/30"
            }`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name={isClockIn ? "exit-outline" : "enter-outline"}
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-center text-white font-bold text-lg">
                {isClockIn ? "Clock Out" : "Clock In"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Enhanced Announcements Section */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-[#053E46]">
              Announcements
            </Text>
            <TouchableOpacity>
              <Text className="text-[#085D6C] text-sm font-semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
            <View className="flex-row items-start">
              <View className="bg-blue-50 p-2 rounded-xl mr-3">
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#085D6C"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[#053E46] font-bold text-base mb-1.5">
                  Update your personal details
                </Text>
                <Text className="text-gray-500 text-sm leading-5 mb-2">
                  Please make sure your contact details are up to date in the
                  system.
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#085D6C] text-sm font-semibold">
                    Update Now →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Additional Announcement */}
          <View className="bg-white p-5 rounded-2xl shadow-sm">
            <View className="flex-row items-start">
              <View className="bg-teal-50 p-2 rounded-xl mr-3">
                <Ionicons name="calendar-outline" size={24} color="#0A6D7F" />
              </View>
              <View className="flex-1">
                <Text className="text-[#053E46] font-bold text-base mb-1.5">
                  Holiday Schedule Updated
                </Text>
                <Text className="text-gray-500 text-sm leading-5 mb-2">
                  New holiday schedule for Q2 2025 has been published. Check
                  your calendar.
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#085D6C] text-sm font-semibold">
                    View Schedule →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
