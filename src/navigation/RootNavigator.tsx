import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { BasicProfileScreen } from '../screens/onboarding/BasicProfileScreen';
import { RehabGoalsScreen } from '../screens/onboarding/RehabGoalsScreen';
import { MedicalHistoryScreen } from '../screens/onboarding/MedicalHistoryScreen';
import { BodyMapScreen } from '../screens/onboarding/BodyMapScreen';
import { PainMobilityScreen } from '../screens/onboarding/PainMobilityScreen';
import { SafetyScreeningScreen } from '../screens/onboarding/SafetyScreeningScreen';
import { ReviewConsentScreen } from '../screens/onboarding/ReviewConsentScreen';
import { HomeDashboard } from '../screens/home/HomeDashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F7FA' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="BasicProfile" component={BasicProfileScreen} />
        <Stack.Screen name="RehabGoals" component={RehabGoalsScreen} />
        <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
        <Stack.Screen name="BodyMap" component={BodyMapScreen} />
        <Stack.Screen name="PainMobility" component={PainMobilityScreen} />
        <Stack.Screen name="SafetyScreening" component={SafetyScreeningScreen} />
        <Stack.Screen name="ReviewConsent" component={ReviewConsentScreen} />
        <Stack.Screen name="Home" component={HomeDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
