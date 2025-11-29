import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../types';

interface ContactItemProps {
    contact: Contact;
    onPress: (contact: Contact) => void;
    showArrow?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({
    contact,
    onPress,
    showArrow = true
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(contact)}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {contact.name ? contact.name.charAt(0).toUpperCase() : contact.phone.charAt(0)}
                </Text>
            </View>

            <View style={styles.details}>
                <Text style={styles.name}>
                    {contact.name || 'Unknown Contact'}
                </Text>
                <Text style={styles.phone}>{contact.phone}</Text>
            </View>

            {showArrow && (
                <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: '#666666',
    },
});

export default ContactItem;