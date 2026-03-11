import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import socket from './utils/socket'; // Assume socket.io-client setup

export default function SearchScreen({ token }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async (text) => {
        setQuery(text);
        if (text.length < 2) return;
        setLoading(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return Alert.alert("Permission denied");
        const loc = await Location.getCurrentPositionAsync({});

        const res = await fetch('http://localhost:3000/api/search/nearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: text,
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                radius: 5
            })
        });

        const data = await res.json();
        setResults(data.results || []);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for milk, chips, etc..."
                placeholderTextColor="#64748b"
                onChangeText={search}
                value={query}
            />

            {loading && <Text style={{ color: '#fff' }}>Searching hyperlocal...</Text>}

            <FlatList
                data={results}
                keyExtractor={i => i.shop_id}
                renderItem={({ item }) => (
                    <View style={[styles.card, item.dist_km > 3 && styles.farCard]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.shopName}>{item.shop_name} • ⭐{item.rating}</Text>
                            <Text style={styles.product}>{item.product_name} — ₹{item.price}</Text>
                            <Text style={styles.meta}>📍 {item.dist_km}km away</Text>
                            {item.dist_km > 3 && (
                                <Text style={styles.warning}>⚠️ Far shop — Higher delivery fee</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={() => Alert.alert("Optimistic Add", "Added to cart!")}>
                            <Text style={styles.btnText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0f', padding: 16, paddingTop: 60 },
    input: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 16 },
    card: { backgroundColor: '#12121a', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e1e2e' },
    farCard: { borderColor: '#ff6b3566' },
    shopName: { color: '#fff', fontWeight: 'bold' },
    product: { color: '#00e5ff', fontSize: 14, marginTop: 4 },
    meta: { color: '#64748b', fontSize: 12 },
    warning: { color: '#ff6b35', fontSize: 11, marginTop: 4 },
    btn: { backgroundColor: '#00e5ff', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 8 },
    btnText: { color: '#000', fontWeight: 'bold' }
});
