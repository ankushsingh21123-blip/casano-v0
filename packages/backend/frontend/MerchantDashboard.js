import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Vibration } from 'react-native';

export default function MerchantDashboard({ shopId, initialStats }) {
    // 1. P&L State
    const [stats, setStats] = useState({
        todaySales: 12500, // ₹
        platformPending: 2450, // Escrow
        completedOrders: 32,
        netProfit: 11875
    });

    // 2. Incoming Order State
    const [incomingOrder, setIncomingOrder] = useState(null);
    const [timer, setTimer] = useState(60);

    // --- MOCK WEBSOCKET LISTENER ---
    useEffect(() => {
        // In a real app, this connects to your Spring Boot WebSocket /ws-merchant endpoint
        const mockOrderPing = setTimeout(() => {
            triggerHotOrder({
                id: "ORD-9982",
                items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Britannia Bread", qty: 1 }],
                estimatedPayout: 142.50
            });
        }, 10000); // Wait 10 seconds, then BAM.

        return () => clearTimeout(mockOrderPing);
    }, []);

    // --- THE "HOT ORDER" ALERT SYSTEM ---
    const triggerHotOrder = (order) => {
        setIncomingOrder(order);
        Vibration.vibrate([1000, 2000, 1000, 2000], true); // Wake the merchant up!

        // Start 60 second countdown
        let countdown = 60;
        const interval = setInterval(() => {
            countdown -= 1;
            setTimer(countdown);
            if (countdown <= 0) {
                clearInterval(interval);
                rejectOrder("Timeout"); // Pass to next shop
            }
        }, 1000);
    };

    const acceptOrder = () => {
        Vibration.cancel();
        Alert.alert("Order Accepted!", "Move items to the Platform Shelf immediately.");
        setIncomingOrder(null);
        setTimer(60);
        // TODO: Call API to set status to PACKING
    };

    const rejectOrder = (reason) => {
        Vibration.cancel();
        setIncomingOrder(null);
        setTimer(60);
        // TODO: Call API to route order to the NEXT nearest shop
    };

    return (
        <View style={styles.container}>
            {/* --- HEADER: P&L DASHBOARD --- */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Kirana Business</Text>
                <Text style={styles.liveStatus}>🟢 Online (Accepting Orders)</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Sales (Today)</Text>
                    <Text style={styles.statValue}>₹{stats.todaySales}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Net Earnings (After Fees)</Text>
                    <Text style={styles.statValueSuccess}>₹{stats.netProfit}</Text>
                </View>
                <View style={styles.statCardSmall}>
                    <Text style={styles.statLabel}>Platform Pending</Text>
                    <Text style={styles.statValuePending}>₹{stats.platformPending}</Text>
                </View>
                <View style={styles.statCardSmall}>
                    <Text style={styles.statLabel}>Orders Done</Text>
                    <Text style={styles.statValue}>{stats.completedOrders}</Text>
                </View>
            </View>

            {/* --- QUICK ACTION TILE: INVENTORY --- */}
            <TouchableOpacity style={styles.scanButton} onPress={() => Alert.alert("Opening Scanner...")}>
                <Text style={styles.scanButtonText}>📷 SCAN BARCODE TO ADD STOCK</Text>
            </TouchableOpacity>

            {/* --- THE INCOMING ORDER MODAL (Z-INDEX SUPER HIGH) --- */}
            <Modal visible={!!incomingOrder} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        <View style={styles.timerRing}>
                            <Text style={styles.timerText}>{timer}S</Text>
                        </View>

                        <Text style={styles.modalTitle}>NEW ORDER NEARBY!</Text>
                        <Text style={styles.payoutText}>You Earn: ₹{incomingOrder?.estimatedPayout}</Text>

                        <View style={styles.itemList}>
                            {incomingOrder?.items.map((item, idx) => (
                                <Text key={idx} style={styles.itemRow}>
                                    • {item.qty}x {item.name}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => rejectOrder("Manual")}>
                                <Text style={styles.btnText}>DECLINE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={acceptOrder}>
                                <Text style={styles.btnText}>ACCEPT</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

// --- STYLING (High Contrast, Large Touch Targets) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8', padding: 20, paddingTop: 60 },
    header: { marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#1a202c' },
    liveStatus: { fontSize: 16, color: '#38a169', fontWeight: 'bold', marginTop: 5 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statCard: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
    statCardSmall: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },

    statLabel: { fontSize: 14, color: '#718096', fontWeight: '600', marginBottom: 5 },
    statValue: { fontSize: 24, fontWeight: '800', color: '#2d3748' },
    statValueSuccess: { fontSize: 24, fontWeight: '800', color: '#319795' }, // Teal
    statValuePending: { fontSize: 20, fontWeight: '700', color: '#d69e2e' }, // Yellow

    scanButton: { backgroundColor: '#2b6cb0', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 4 },
    scanButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center' },

    timerRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e53e3e', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    timerText: { color: '#fff', fontSize: 28, fontWeight: '900' },

    modalTitle: { fontSize: 24, fontWeight: '900', color: '#1a202c', textAlign: 'center' },
    payoutText: { fontSize: 20, fontWeight: '800', color: '#38a169', marginVertical: 10 },

    itemList: { width: '100%', backgroundColor: '#f7fafc', padding: 15, borderRadius: 10, marginVertical: 15 },
    itemRow: { fontSize: 18, fontWeight: '600', color: '#4a5568', marginBottom: 5 },

    actionRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10 },
    btn: { width: '48%', padding: 20, borderRadius: 12, alignItems: 'center' },
    btnReject: { backgroundColor: '#e2e8f0' },
    btnAccept: { backgroundColor: '#48bb78', elevation: 5 },
    btnText: { fontSize: 18, fontWeight: '800', color: '#1a202c' }
});
