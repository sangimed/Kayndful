import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TaskScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Task ID: {id}</Text>
    </View>
  );
}
