import React, { useState } from 'react';
import AvailabilityToggle from './AvailabilityToggle';

/**
 * Example usage of AvailabilityToggle component
 * This shows how to integrate the component with social media links
 */
const AvailabilityToggleExample = () => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (newStatus) => {
        setLoading(true);

        // Simulate API call to update availability status
        try {
            // Replace this with your actual API call
            // await updateUserAvailability(newStatus);

            setTimeout(() => {
                setIsAvailable(newStatus);
                setLoading(false);
                console.log('Availability updated to:', newStatus);
            }, 500);
        } catch (error) {
            console.error('Failed to update availability:', error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

            {/* Example 1: With social links */}
            <AvailabilityToggle
                isAvailable={isAvailable}
                onToggle={handleToggle}
                loading={loading}
                socialLinks={{
                    linkedin: 'https://linkedin.com/in/yourprofile',
                    github: 'https://github.com/yourusername',
                    leetcode: 'https://leetcode.com/yourusername'
                }}
            />

            {/* Example 2: Without social links (they will be disabled) */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Without Social Links:</h3>
                <AvailabilityToggle
                    isAvailable={isAvailable}
                    onToggle={handleToggle}
                    loading={loading}
                />
            </div>

            {/* Example 3: With partial social links */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">With Partial Links:</h3>
                <AvailabilityToggle
                    isAvailable={isAvailable}
                    onToggle={handleToggle}
                    loading={loading}
                    socialLinks={{
                        github: 'https://github.com/yourusername',
                        // LinkedIn and LeetCode will be disabled
                    }}
                />
            </div>
        </div>
    );
};

export default AvailabilityToggleExample;
