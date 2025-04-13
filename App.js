import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';

const API_KEY = 'AIzaSyBqsgteFWLjLED8hPcdcuOnVZUC6l4_RP0';

export default function App() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [earnedItems, setEarnedItems] = useState([]);
  
  const rewardEmojis = ['🪴', '🧸', '🪑', '🎨', '🖼️', '🐱', '💡', '📚', '🛏️', '🎮', '🎹', '🖥️', '🪞', '🛋️', '⏰', '👛', '👗','💄'];
  const [rewardOptions, setRewardOptions] = useState([]);
const [selectingReward, setSelectingReward] = useState(false);
const affirmations = [
  "You're so strong!", 
  "You got this!!", 
  "You did that!",
  "Progress over perfection!!",
  "Small wins are BIG wins!",
  "You're showing up, and that's enough!!",
  "One step at a time!",
  "Look at you go!!",
];



  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setter(result.assets[0]);
    }
  };

  const analyzeImage = async (base64) => {
    const body = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: 'OBJECT_LOCALIZATION' }]
        }
      ]
    };
  
    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
    
    // 👇👇 ADD THIS RIGHT HERE 👇👇
    console.log("Google Vision response:", data);
    
    return data.responses[0].localizedObjectAnnotations || [];
  };
  

  const calculateScore = async () => {
    if (!beforeImage || !afterImage) {
      Alert.alert('Please select both images');
      return;
    }
  
    setLoading(true);
  
    try {
      const beforeObjects = await analyzeImage(beforeImage.base64);
      const afterObjects = await analyzeImage(afterImage.base64);
  
      console.log("Before Objects:", beforeObjects);
      console.log("After Objects:", afterObjects);
  
      const beforeCount = beforeObjects.length;
      const afterCount = afterObjects.length;
  
      if (beforeCount === 0) {
        setScore(0); // avoid division by zero
      } else {
        const reduction = beforeCount - afterCount;
        let cleanlinessScore = (reduction / beforeCount) * 100;
        cleanlinessScore = Math.max(0, Math.min(100, Math.round(cleanlinessScore)));
        setScore(cleanlinessScore);
  
        // ✅ Reward logic now inside here
        if (cleanlinessScore >= 70) {
          const shuffled = [...rewardEmojis].sort(() => 0.5 - Math.random());
          const options = shuffled.slice(0, 3);
          setRewardOptions(options);
          setSelectingReward(true);
        }
        
      }
  
    } catch (error) {
      console.error("❌ Error during analysis:", error);
      Alert.alert("Vision API failed", "Please check your API key and internet connection.");
    }
  
    setLoading(false);
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
Alert.alert(randomAffirmation);
  };
  

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
     <Animatable.View
  animation={{
    from: { opacity: 0, transform: [{ translateY: 150 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
  }}
  duration={1500}
  delay={200}
>
  <Text style={styles.title}>🌸 Room Bloom 🌸</Text>
</Animatable.View>


<Animatable.View animation="fadeInUp" delay={1700} duration={1200}>
  <View style={styles.buttonGroup}>
    <TouchableOpacity style={styles.customButton} onPress={() => pickImage(setBeforeImage)}>
      <Text style={styles.customButtonText}>Select BEFORE image</Text>
    </TouchableOpacity>
    {beforeImage && <Image source={{ uri: beforeImage.uri }} style={styles.image} />}
  </View>

  <View style={styles.buttonGroup}>
    <TouchableOpacity style={styles.customButton} onPress={() => pickImage(setAfterImage)}>
      <Text style={styles.customButtonText}>Select AFTER image</Text>
    </TouchableOpacity>
    {afterImage && <Image source={{ uri: afterImage.uri }} style={styles.image} />}
  </View>

  <View style={styles.buttonGroup}>
    <TouchableOpacity
      style={[styles.customButton, loading && styles.disabledButton]}
      onPress={calculateScore}
      disabled={loading}
    >
      <Text style={styles.customButtonText}>
        {loading ? 'Analyzing...' : 'Calculate Score'}
      </Text>
    </TouchableOpacity>
  </View>
</Animatable.View>


      {score !== null && (
        <Text style={styles.score}> Cleanliness Score: {score} / 100</Text>
      )}
      {earnedItems.length > 0 && (
  <View style={styles.room}>
    <Text style={styles.roomTitle}> Your Room</Text>
    <View style={styles.emojiGrid}>
      {earnedItems.map((item, index) => (
        <Text key={index} style={styles.emoji}>{item}</Text>
      ))}
    </View>
  </View>
)}
{selectingReward && (
  <View style={styles.rewardPicker}>
    <Text style={styles.roomTitle}>🎁 Choose a reward for your room:</Text>
    <View style={styles.emojiGrid}>
      {rewardOptions.map((emoji, index) => (
        <Text
          key={index}
          style={styles.rewardOption}
          onPress={() => {
            setEarnedItems(prev => [...prev, emoji]);
            Alert.alert("🎉 Added to Room!", `You picked: ${emoji}`);
            setSelectingReward(false);
            setRewardOptions([]);
          }}
        >
          {emoji}
        </Text>
      ))}
    </View>
  </View>
)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D0B0A6', 
    padding: 20,
    paddingBottom: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40, 
    textAlign: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
    paddingHorizontal: 16,
    lineHeight: 38,
    color: '#685792',
    fontFamily: "Verdana",
  },
  buttonGroup: {
    marginBottom: 25,
    alignItems: 'center',
    color: '#EFBDC6',
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 10,
  },
  score: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '600',
  },
  room: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#CBEEF3',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 30,
    margin: 5,
  },  
  rewardPicker: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#F0BEAF',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  rewardOption: {
    fontSize: 34,
    margin: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  customButton: {
    backgroundColor: '#EFBDC6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#685792',
    marginTop: 10,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  customButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#685792',
    fontFamily: 'Verdana',
  },
  
  disabledButton: {
    opacity: 0.6,
  }
  
  
});
