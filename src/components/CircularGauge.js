import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Trash2 } from 'lucide-react-native';

const CircularGauge = ({ percentage }) => {
  const strokeWidth = 14; 
  
  const radius = 80; 

  const totalArcLength = 2 * Math.PI * radius * 0.77; 
  
  const dashOffset = totalArcLength - (totalArcLength * percentage) / 100;

  return (
    <View style={styles.container}>
      <Svg width="280" height="280" viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="50%" stopColor="#FFC107" />
            <Stop offset="100%" stopColor="#F44336" />
          </LinearGradient>
        </Defs>

        {/* Background Track (Gray) */}
        <Path
          d="M 60 180 A 75 75 0 1 1 140 180"
          fill="none"
          stroke="#F2F2F2"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress Track (Colored) */}
        <Path
          d="M 60 180 A 75 75 0 1 1 140 180"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={totalArcLength}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.labelContainer}>
        <Trash2 size={60} color="#333" style={{ marginBottom: 15 }} />
        <Text style={styles.percentText}>{percentage}%</Text>
        <Text style={styles.statusText}>Filled</Text>
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
    top: 90, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  percentText: { 
    fontSize: 52, 
    fontWeight: 'bold', 
    color: '#F44336', // You could also make this dynamic!
    lineHeight: 55
  },
  statusText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#1A1A1A',
    marginTop: -5
  }
});

export default CircularGauge;