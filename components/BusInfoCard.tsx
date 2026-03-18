import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

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
}

export default function BusInfoCard({ bus } : BusInfoCardProps) {

    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [bus]);

    if (!bus) return null;

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.busNumber}>{bus.name}</Text>
                    <Text style={styles.routeNumber}>Route: {bus.route}</Text>
                    <Text style={styles.subText}>
                        {bus.distance || "Calculating..."} | {bus.passengers || 0} Passengers
                    </Text>
                </View>

                <View style={styles.iconCircle}>
                    <FontAwesome5 name="bus" size={30} color="black" />
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.row}>
                    <Text style={styles.label}>Model: </Text>
                    {bus.model}
                </Text>
                <Text style={styles.row}>
                    <Text style={styles.label}>Path: </Text>
                    {bus.start_location} to {bus.end_location}
                </Text>
                <Text style={styles.row}>
                    <Text style={styles.label}>Base Fare: </Text>
                    LKR {bus.price ? bus.price.toFixed(2) : "0.00"}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        elevation: 10,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    header: {
        backgroundColor: "#003366",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    busNumber: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold"
    },
    routeNumber: {
        color: "white",
        fontSize: 16,
        marginBottom: 5
    },
    subText: {
        color: "white",
        fontSize: 13
    },
    iconCircle: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    body: {
        backgroundColor: "#B4D8FF",
        padding: 20,
        paddingBottom: 10
    },
    row: {
        marginBottom: 10,
        backgroundColor: "#1c6999",
        padding: 10,
        borderRadius: 10,
        fontSize: 15,
        color: "#ffffff"
    },
    label: {
        fontWeight: "bold",
        color: "white"
    },
});