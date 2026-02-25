import React from 'react';

const ProgressDashboard: React.FC<{ streak: number; achievements: string[]; meditationStats: { totalMeditations: number; longestStreak: number; averageDuration: number; }}> = ({ streak, achievements, meditationStats }) => {
    return (
        <div>
            <h1>Meditation Progress Dashboard</h1>
            <div>
                <h2>Meditation Statistics</h2>
                <p>Total Meditations: {meditationStats.totalMeditations}</p>
                <p>Longest Streak: {meditationStats.longestStreak} days</p>
                <p>Average Duration: {meditationStats.averageDuration} minutes</p>
            </div>
            <div>
                <h2>Streaks</h2>
                <p>Current Streak: {streak} days</p>
            </div>
            <div>
                <h2>Achievements</h2>
                <ul>
                    {achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProgressDashboard;