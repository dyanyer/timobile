import ClockInButton from "@/components/buttons/clockIn";
import ClockOutButton from "@/components/buttons/clockOut";
import MainBackgroundGradient from "@/components/gradients/mainBackground";
import axiosClient from "@/services/axios";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Home() {
  const [isClockIn, setIsClockIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockInDate, setClockInDate] = useState<string | null>(null);
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false); // ✅ for pull-to-refresh

  // Add new state
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [shiftCompleted, setShiftCompleted] = useState(false);

  // formatters
  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (time: Date) => {
    const day = time.getDate().toString().padStart(2, "0");
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const year = time.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // ✅ extract fetch function
  const fetchAttendanceStatus = useCallback(async () => {
    try {
      const res = await axiosClient.get("/attendance-employee");
      const latest = res.data.latest;

      // inside fetchAttendanceStatus
      if (latest) {
        if (latest.date_time_in && !latest.date_time_out) {
          // user is clocked in
          setIsClockIn(true);
          setShiftCompleted(false);
          setClockInTime(
            new Date(latest.date_time_in).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          setClockInDate(new Date(latest.date_time_in).toLocaleDateString());
          setShiftId(latest.shift_id ?? null);
          setClockOutTime(null);
        } else if (latest.date_time_in && latest.date_time_out) {
          // shift completed
          setIsClockIn(false);
          setShiftCompleted(true);
          setClockInTime(
            new Date(latest.date_time_in).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          setClockInDate(new Date(latest.date_time_in).toLocaleDateString());
          setClockOutTime(
            new Date(latest.date_time_out).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          setShiftId(latest.shift_id ?? null);
        } else {
          // no attendance today
          setIsClockIn(false);
          setShiftCompleted(false);
          setClockInTime(null);
          setClockInDate(null);
          setClockOutTime(null);
          setShiftId(null);
        }
      }

      if (latest && latest.date_time_in && !latest.date_time_out) {
        setIsClockIn(true);
        setClockInTime(
          new Date(latest.date_time_in).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setClockInDate(new Date(latest.date_time_in).toLocaleDateString());
        setShiftId(latest.shift_id ?? null);
      } else {
        setIsClockIn(false);
        setClockInTime(null);
        setClockInDate(null);
        setShiftId(null);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  }, []);

  // ✅ initial load
  useEffect(() => {
    fetchAttendanceStatus();
  }, [fetchAttendanceStatus]);

  // ✅ handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceStatus();
    setRefreshing(false);
  };

  const quickActions = [
    { label: "Payslip", icon: "cash-outline", color: "#085D6C" },
    { label: "Calendar", icon: "calendar-outline", color: "#085D6C" },
    { label: "Shift", icon: "time-outline", color: "#085D6C" },
    { label: "Overtime", icon: "alarm-outline", color: "#085D6C" },
    { label: "Leave", icon: "airplane-outline", color: "#085D6C" },
    { label: "Attendance", icon: "checkmark-done-outline", color: "#085D6C" },
    { label: "Holiday", icon: "calendar-clear-outline", color: "#085D6C" },
    { label: "Assets", icon: "cube-outline", color: "#085D6C" },
  ];

  return (
    <SafeAreaView className="h-full flex-1 bg-[#053E46] items-center justify-evenly">
      <MainBackgroundGradient />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } // ✅ pull-to-refresh
      >
        {/* Greeting Header */}
        <View className="p-8">
          <View className="bg-white blur-sm p-4 rounded-lg flex-row items-center justify-between">
            <View className="bg-[#053E46] w-16 h-16 rounded-lg overflow-hidden">
              <Image
                source={{
                  uri: "https://jafdigital.co/wp-content/uploads/2025/07/timora-logo-w.webp",
                }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            </View>
            <Text className="text-3xl font-extrabold text-[#053E46] ml-4">
              Hello, User 👋
            </Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View className="p-6">
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="items-center mb-6"
                style={{ width: (width - 48) / 4, paddingHorizontal: 6 }}
                activeOpacity={0.8}
              >
                <Animated.View
                  className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: item.color }}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color="white"
                  />
                </Animated.View>
                <Text className="text-xs text-center text-white font-semibold mt-2">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Attendance Section */}
        <View className="px-6 mt-10">
          <Text className="text-xl font-bold text-white mb-5">Attendance</Text>
          <View className="bg-white p-5 rounded-3xl shadow-lg">
            <View className="flex-row items-center mb-4">
              <View
                className={`w-3 h-3 rounded-full mr-2 ${
                  isClockIn
                    ? "bg-green-500"
                    : shiftCompleted
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              />
              <Text className="text-base font-semibold text-[#053E46]">
                {isClockIn
                  ? "Currently Clocked In"
                  : shiftCompleted
                  ? "Shift Completed"
                  : "Currently Clocked Out"}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Clock In</Text>
                <Text className="text-2xl font-extrabold text-[#085D6C]">
                  {clockInTime ?? "--:--"}
                </Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-gray-500 text-sm mb-1">Clock Out</Text>
                <Text className="text-2xl font-extrabold text-[#0A6D7F]">
                  {clockOutTime ?? "--:--"}
                </Text>
              </View>
            </View>

            {clockInDate && (
              <View className="mt-4">
                <Text className="text-sm text-center text-[#053E46]">
                  {shiftCompleted
                    ? `Shift completed on: ${clockInDate}`
                    : `Clocked in on: ${clockInDate}`}
                </Text>
              </View>
            )}
          </View>

          {/* Clock In/Out Button */}
          {/* Clock In/Out Button */}
          {!isClockIn && !shiftCompleted ? (
            <ClockInButton
              isClockIn={isClockIn}
              onClockInChange={(status: boolean) => {
                if (status) {
                  const currentTime = new Date();
                  setClockInTime(formatTime(currentTime));
                  setClockInDate(formatDate(currentTime));
                } else {
                  setClockInTime(null);
                  setClockInDate(null);
                }
                setIsClockIn(status);
              }}
            />
          ) : isClockIn ? (
            <ClockOutButton
              shiftId={shiftId ?? 1}
              onClockOutSuccess={(time: string) => {
                setIsClockIn(false);
                setShiftCompleted(true);
                setClockOutTime(time);
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
