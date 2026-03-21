import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface AnalyticsData {
    totalTrips: number;
    totalSpent: number;
    totalminutes: number;
    weeklyChart: { day: string; trips: number; height: string }[];
    topRoute: { code: string; name: string; count: number; } | null;
}

export default function AnalyticsScreen() {
    const router = useRouter();

    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fadeAnim1 = useRef(new Animated.Value(0)).current;
    const slideAnim1 = useRef(new Animated.Value(30)).current;
    
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const slideAnim2 = useRef(new Animated.Value(30)).current;
    
    const fadeAnim3 = useRef(new Animated.Value(0)).current;
    const slideAnim3 = useRef(new Animated.Value(30)).current;
    
    const fadeAnim4 = useRef(new Animated.Value(0)).current;
    const slideAnim4 = useRef(new Animated.Value(30)).current;

    const barAnim = useRef(new Animated.Value(0)).current;

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;

        return `${hours}h ${mins}m`;
    };

    const fetchAnalytics = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                setLoading(false);
                return;
            }

            const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/analytics`;

            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                setData(result.data);
            }
        } catch (error) {
            console.log("Error fetching Analytics:", error);
        }
        finally{
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnalytics();
        }, [])
    );

    useEffect(() => {
        if (!loading && data) {
            fadeAnim1.setValue(0); slideAnim1.setValue(30);
            fadeAnim2.setValue(0); slideAnim2.setValue(30);
            fadeAnim3.setValue(0); slideAnim3.setValue(30);
            fadeAnim4.setValue(0); slideAnim4.setValue(30);
            barAnim.setValue(0);

            Animated.stagger(150, [
                Animated.parallel([
                Animated.timing(fadeAnim1, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(slideAnim1, { toValue: 0, duration: 500, useNativeDriver: true }),
                ]),
                Animated.parallel([
                Animated.timing(fadeAnim2, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(slideAnim2, { toValue: 0, duration: 500, useNativeDriver: true }),
                ]),
                Animated.parallel([
                Animated.timing(fadeAnim3, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(slideAnim3, { toValue: 0, duration: 500, useNativeDriver: true }),
                ]),
                Animated.parallel([
                Animated.timing(fadeAnim4, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(slideAnim4, { toValue: 0, duration: 500, useNativeDriver: true }),
                ]),
            ]).start();

            Animated.timing(barAnim, {
                toValue: 1,
                duration: 1000,
                delay: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [loading, data]);

    if (loading) {
        return (
            <LinearGradient colors={['#3B6D8F', '#0E1A23']} style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#00E5FF" />
            </LinearGradient>
        );
    }

    return(
        <LinearGradient
            colors={['#3B6D8F', '#0E1A23']} style={styles.container}
        >
            <Stack.Screen 
                options={{
                    headerTitle: "",
                    headerStyle: { backgroundColor: '#3B6D8F' }, 
                    headerTintColor: '#fff',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                        <Text style={styles.backText}>Go Back</Text>
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Your Journey</Text>
                    <Text style={styles.subtitle}>Impact & Analytics</Text>
                </View>

                <Animated.View style={[styles.card, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Total Fares Paid</Text>
                        <Ionicons name="wallet" size={24} color="#00E5FF" />
                    </View>
                    <Text style={styles.heroNumber}>
                        {data?.totalSpent ? parseFloat(String(data.totalSpent)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'} 
                        <Text style={styles.heroUnit}> LKR</Text>
                    </Text>
                    <Text style={styles.cardSubtext}>Invested in your daily commute.</Text>
                </Animated.View>

                <Animated.View style={[styles.card, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Time on Board</Text>
                        <Ionicons name="time" size={24} color="#139456" />
                    </View>
                    <Text style={styles.statNumber}>{formatTime(data?.totalminutes || 0)} <Text style={styles.statUnit}>Hours</Text></Text>
                    <Text style={styles.cardSubtext}>Spent safely traveling to your destinations.</Text>
                </Animated.View>

                <Animated.View style={[styles.card, { opacity: fadeAnim3, transform: [{ translateY: slideAnim3 }] }]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Trips This Week</Text>
                        <Ionicons name="bar-chart" size={24} color="#82C4BE" />
                    </View>
                    
                    <View style={styles.chartContainer}>
                        {data?.weeklyChart?.map((item, index) => (
                        <View key={index} style={styles.barWrapper}>
                            <Animated.View 
                            style={[styles.bar, { 
                                height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', item.height] }) 
                            }]} 
                            />
                            <Text style={styles.barLabel}>{item.day}</Text>
                        </View>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View style={[styles.card, { opacity: fadeAnim4, transform: [{ translateY: slideAnim4 }] }]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Most Frequent Route</Text>
                        <Ionicons name="star" size={24} color="#F3D19C" />
                    </View>
                    
                    {data?.topRoute ? (
                        <View style={styles.routeRow}>
                        <View style={styles.routeBadge}>
                            <Text style={styles.routeBadgeText}>{data.topRoute.code}</Text>
                        </View>
                        <View style={styles.routeTextContainer}>
                            <Text style={styles.routeText}>{data.topRoute.name}</Text>
                            <Text style={styles.cardSubtext}>Taken {data.topRoute.count} times</Text>
                        </View>
                        </View>
                    ) : (
                        <Text style={styles.cardSubtext}>No completed trips yet. Start exploring!</Text>
                    )}
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    backText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
    },
    headerContainer: {
        marginBottom: 30,
        marginTop: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 18,
        color: '#00E5FF',
        fontWeight: '500',
        marginTop: 5,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)', // Premium Frosted Glass
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    heroNumber: {
        fontSize: 38, // Slightly reduced to fit big LKR amounts
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    heroUnit: {
        fontSize: 20,
        color: '#82C4BE',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    statUnit: {
        fontSize: 16,
        color: '#139456',
        fontWeight: '600',
    },
    cardSubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 5,
    },
    
    // Custom Bar Chart Flex
    chartContainer: {
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 10,
    },
    barWrapper: {
        alignItems: 'center',
        width: (width - 100) / 7, // Evenly space 7 bars
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: 12,
        backgroundColor: '#00E5FF',
        borderRadius: 6,
        marginBottom: 8,
        // Add a glowing effect
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    barLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '600',
    },

    // Route specific
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    routeBadge: {
        backgroundColor: '#0A1926',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    routeBadgeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    routeTextContainer: {
        flex: 1, // Ensures long route names wrap properly
    },
    routeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        flexWrap: 'wrap',
    }
});
