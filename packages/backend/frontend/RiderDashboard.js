import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Vibration } from 'react-native';

export default function RiderDashboard({ driverId }) {

    // 1. Rider Stats & Earnings State
    const [stats, setStats] = useState({
        status: "IDLE", // IDLE, EN_ROUTE_SHOP, EN_ROUTE_DROP
        earningsToday: 745,
        deliveriesDone: 11,
        hoursOnline: 3.5,
        earningsPerMin: 3.54 // The psycholocigal gamification metric
    });

    // 2. The Current Active Job
    const [activeJob, setActiveJob] = useState(null);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otpInput, setOtpInput] = useState("");

    // --- MOCK WEBSOCKET LISTENER ---
    // In reality, this connects to /ws-driver via Spring Boot
    useEffect(() => {
        if (stats.status !== "IDLE") return;

        const ping = setTimeout(() => {
            receiveDispatchPing({
                orderId: "ORD-9982",
                shopName: "Krishna General Store",
                distanceToShop: "0.8km",
                distanceToDrop: "2.1km",
                estimatedPayout: 35.00,
                timeLimitMins: 11
            });
        }, 8000); // New order pings in 8 seconds

        return () => clearTimeout(ping);
    }, [stats.status]);

    const receiveDispatchPing = (jobParams) => {
        Vibration.vibrate([1000, 2000, 1000, 2000], true);
        setActiveJob(jobParams);
        setStats({ ...stats, status: "EN_ROUTE_SHOP" });
    };

    // --- The TRIPLE-OTP Step Functions ---
    const handleOtpSubmit = () => {
        if (otpInput.length !== 4) return Alert.alert("Error", "Enter 4 digit OTP");

        // STEP 1: MERCHANT OTP VERIFICATION
        if (stats.status === "EN_ROUTE_SHOP") {
            // TODO: Call backend /verify with role="delivery"
            if (otpInput === "1234") { // Mock Validation
                Alert.alert("Success", "Package Secured! Navigate to Customer.");
                setStats({ ...stats, status: "EN_ROUTE_DROP" });
                setOtpModalVisible(false);
                setOtpInput("");
            } else {
                Alert.alert("Fraud Alert", "Incorrect Merchant OTP");
            }
        }

        // STEP 2 & 3: CUSTOMER OTP VERIFICATION
        else if (stats.status === "EN_ROUTE_DROP") {
            // TODO: Call backend /verify with role="customer_delivery"
            if (otpInput === "5678") { // Mock Validation
                Alert.alert("Delivered!", "Escrow Released. Earnings updated.");

                // Reset to IDLE, bump earnings
                setStats({
                    ...stats,
                    status: "IDLE",
                    earningsToday: stats.earningsToday + activeJob.estimatedPayout,
                    deliveriesDone: stats.deliveriesDone + 1
                });
                setActiveJob(null);
                setOtpModalVisible(false);
                setOtpInput("");
            } else {
                Alert.alert("Fraud Alert", "Incorrect Customer OTP");
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* --- HEADER: GAMIFIED EARNINGS --- */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Rider Partner App</Text>
                <View style={[styles.statusBadge, stats.status === 'IDLE' ? styles.bgGreen : styles.bgYellow]}>
                    <Text style={styles.statusText}>{stats.status}</Text>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Earnings Today</Text>
                    <Text style={styles.statValue}>₹{stats.earningsToday}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Deliveries</Text>
                    <Text style={styles.statValue}>{stats.deliveriesDone}</Text>
                </View>
                <View style={styles.statCardLong}>
                    <Text style={styles.statLabel}>Earnings Per Minute</Text>
                    <Text style={styles.statValueSuccess}>₹{stats.earningsPerMin}</Text>
                </View>
            </View>

            {/* --- ACTIVE JOB CARD (Z-PATTERN ROUTING) --- */}
            {activeJob ? (
                <View style={styles.jobCard}>
                    <Text style={styles.jobTitle}>ACTIVE DELIVERY</Text>
                    <Text style={styles.shopName}>📍 {activeJob.shopName}</Text>

                    <View style={styles.routeBox}>
                        <Text style={styles.routeText}>Shop: {activeJob.distanceToShop} away</Text>
                        <Text style={styles.routeText}>Drop: {activeJob.distanceToDrop} further</Text>
                    </View>

                    <Text style={styles.payoutText}>Payout: ₹{activeJob.estimatedPayout}</Text>

                    {/* DYNAMIC ACTION BUTTON BASED ON STATE */}
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setOtpModalVisible(true)}
                    >
                        <Text style={styles.actionBtnText}>
                            {stats.status === 'EN_ROUTE_SHOP' ? "ARRIVED AT SHOP (ENTER MERCHANT OTP)" : "ARRIVED AT CUSTOMER (ENTER DROPOFF OTP)"}
                        </Text>
                    </TouchableOpacity>

                </View>
            ) : (
                <View style={styles.searchingBox}>
                    <Text style={styles.searchingText}>Searching for nearby orders...</Text>
                    <View style={styles.radarPulse}></View>
                </View>
            )}

            {/* --- TRIPLE-OTP ENTRY MODAL --- */}
            <Modal visible={otpModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Authentication Required</Text>
                        <Text style={styles.modalSub}>
                            {stats.status === 'EN_ROUTE_SHOP' ? "Scan or typing the OTP from the Shopkeeper's App." : "Ask the customer for their 4-digit Delivery OTP."}
                        </Text>

                        {/* Mock Input for React Native */}
                        <View style={styles.otpInputBox}>
                            <Text style={styles.otpMockText}>{otpInput || "____"}</Text>
                        </View>

                        {/* Mock Numpad */}
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 10 }}>
                            <TouchableOpacity onPress={() => setOtpInput(otpInput + "1")}><Text style={{ fontSize: 24 }}>1</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setOtpInput(otpInput + "2")}><Text style={{ fontSize: 24 }}>2</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setOtpInput(otpInput + "3")}><Text style={{ fontSize: 24 }}>3</Text></TouchableOpacity>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => { setOtpModalVisible(false); setOtpInput("") }}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnVerify]} onPress={handleOtpSubmit}>
                                <Text style={styles.btnText}>VERIFY</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111827', padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#f3f4f6' },

    statusBadge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    statusText: { color: '#fff', fontWeight: '800', fontSize: 14 },
    bgGreen: { backgroundColor: '#10b981' },
    bgYellow: { backgroundColor: '#f59e0b' },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statCard: { width: '48%', backgroundColor: '#1f2937', padding: 15, borderRadius: 12, marginBottom: 15 },
    statCardLong: { width: '100%', backgroundColor: '#1f2937', padding: 15, borderRadius: 12, marginBottom: 20, borderColor: '#10b981', borderWidth: 1 },

    statLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '600', marginBottom: 5 },
    statValue: { fontSize: 22, fontWeight: '800', color: '#f3f4f6' },
    statValueSuccess: { fontSize: 24, fontWeight: '900', color: '#34d399' },

    jobCard: { backgroundColor: '#000', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#374151', elevation: 10 },
    jobTitle: { color: '#f59e0b', fontSize: 14, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
    shopName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },

    routeBox: { backgroundColor: '#1f2937', padding: 15, borderRadius: 10, marginBottom: 15 },
    routeText: { color: '#d1d5db', fontSize: 16, fontWeight: '600', marginVertical: 3 },

    payoutText: { color: '#10b981', fontSize: 22, fontWeight: '900', textAlign: 'center', marginVertical: 10 },

    actionBtn: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', textAlign: 'center' },

    searchingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchingText: { color: '#9ca3af', fontSize: 16, fontWeight: '600' },
    radarPulse: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#3b82f6', opacity: 0.5, marginTop: 20 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', backgroundColor: '#1f2937', borderRadius: 20, padding: 25, alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center' },
    modalSub: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginVertical: 10 },

    otpInputBox: { backgroundColor: '#000', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center', marginVertical: 15 },
    otpMockText: { color: '#34d399', fontSize: 32, fontWeight: 'bold', letterSpacing: 10 },

    actionRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 20 },
    btn: { width: '48%', padding: 15, borderRadius: 12, alignItems: 'center' },
    btnCancel: { backgroundColor: '#374151' },
    btnVerify: { backgroundColor: '#10b981' },
    btnText: { fontSize: 16, fontWeight: '800', color: '#fff' }
});
