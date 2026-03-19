import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Animated, Dimensions, PanResponder } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export interface BusData {
    bus_id: number;
    name: string;
    model: string;
    route: string;
    start_location: string;
    end_location: string;
    price: number;
    latitude: number;
    longitude: number;

    distance?: string;
    passengers?: number;

    heading? : number;
}

interface BusInfoCardProps {
    bus: BusData | null;
    onClose: () => void;
}

const HIDDEN_Y = 500;
const screenHeight = Dimensions.get("window").height;

export default function BusInfoCard({ bus, onClose } : BusInfoCardProps) {

    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    const [displayBus, setDisplayBus] = useState<BusData | null>(null);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 10;
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    onClose();
                }
            }
        })
    ).current;

    useEffect(() => {
        if (bus) {
            setDisplayBus(bus);
            Animated.spring(slideAnim, {
                toValue: 0,
                bounciness: 4,
                speed: 12,
                useNativeDriver: true,
            }).start();
        }
        else {
            Animated.timing(slideAnim, {
                toValue: HIDDEN_Y,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setDisplayBus(null);
            });
        }
    }, [bus]);

    if (!displayBus) return null;

    return (
        <Animated.View
            {...panResponder.panHandlers} 
            pointerEvents={bus ? "auto" : "none"}
            style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}
        >
            <LinearGradient
                colors={['#4475A0', '#06202E']}
                style={styles.gradientFill}
            >
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle}/>
                </View>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.busNumber}>{displayBus.name}</Text>
                        <Text style={styles.routeNumber}>Route: {displayBus.route}</Text>
                        <Text style={styles.subText}>
                            {displayBus.distance || "Calculating..."} | {displayBus.passengers || 0} Passengers
                        </Text>
                    </View>

                    <View style={styles.iconCircle}>
                        <FontAwesome5 name="bus" size={30} color="#82C4BE" />
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.row}>
                        <FontAwesome5 name="cog" size={18} color="#44DCD0" style={styles.rowIcon}/>
                        <Text style={styles.rowText}>
                            <Text style={styles.label}>Model: </Text>
                            {displayBus.model}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome5 name="route" size={18} color="#44DCD0" style={styles.rowIcon}/>
                        <Text style={styles.rowText}>
                            <Text style={styles.label}>Path: </Text>
                            {displayBus.start_location} to {displayBus.end_location}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome5 name="dollar-sign" size={18} color="#44DCD0" style={styles.rowIcon}/>
                        <Text style={styles.rowText}>
                            <Text style={styles.label}>Base Fare: </Text>
                            LKR {displayBus.price ? displayBus.price.toFixed(2) : "0.00"}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        position: "absolute",
        bottom: -5, 
        left: 0,
        right: 0,
        zIndex: 999,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    gradientFill: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 25,
    },
    dragHandleContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    header: {
        backgroundColor: "rgba(255, 255, 255, 0.15)", 
        borderRadius: 15,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    busNumber: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold"
    },
    routeNumber: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 4,
        marginBottom: 6
    },
    subText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 13
    },
    iconCircle: {
        backgroundColor: "#0A1926", 
        width: 55,
        height: 55,
        borderRadius: 27.5,
        justifyContent: "center",
        alignItems: "center"
    },
    body: {
        paddingBottom: 10
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#03111C", 
        borderColor: "#0084B4",
        borderWidth: 1.5,
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
    },
    rowIcon: {
        marginRight: 15,
        width: 20,
        textAlign: "center",
    },
    rowText: {
        fontSize: 15,
        color: "#E0F7FA", 
    },
    label: {
        fontWeight: "bold",
        color: "#00E5FF" 
    },
});