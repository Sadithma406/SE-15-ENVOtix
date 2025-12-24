import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Trash2 } from 'lucide-react-native';

const CircularGauge = ({ percentage }) => {
  const strokeWidth = 14; 
  const radius = 90 * percentage / 100;

  /**
   * ARC LENGTH INCREASE: 
   * I increased the multiplier to 1.65 to account for the extra wrap-around.
   */
  const circumference = radius * Math.PI * 1.65; 
  const dashOffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.container}>
      {/* Svg height increased to 280 to handle the extreme downward curve */}
      <Svg width="280" height="280" viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="50%" stopColor="#FFC107" />
            <Stop offset="100%" stopColor="#F44336" />
          </LinearGradient>
        </Defs>

        {/* PATH CHANGE: 
          Start at (60, 180) and End at (140, 180). 
          Moving these X-coordinates closer together makes the circle wrap further down.
        */}
        <Path
          d="M 60 180 A 75 75 0 1 1 140 180"
          fill="none"
          stroke="#F2F2F2"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <Path
          d="M 60 180 A 75 75 0 1 1 140 180"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.labelContainer}>
        <Trash2 size={60} color="#333" style={{ marginBottom: 20 }} />
        <Text style={styles.percentText}>{percentage}%</Text>
        <Text style={styles.statusText}>Full</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    justifyContent: 'center',
    height: 280 
  },
  labelContainer: { 
    position: 'absolute', 
    top: 95, // Pushed lower to center it inside the near-complete circle
    alignItems: 'center',
    justifyContent: 'center'
  },
  percentText: { 
    fontSize: 52, 
    fontWeight: 'bold', 
    color: '#F44336',
    lineHeight: 55
  },
  statusText: { 
    fontSize: 38, 
    fontWeight: 'bold', 
    color: '#1A1A1A',
    marginTop: -5
  }
});

export default CircularGauge;