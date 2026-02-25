import React from 'react';
import './ProgressDashboard.css';

interface MeditationStats {
    totalMeditations: number;
    longestStreak: number;
    averageDuration: number;
    weeklyTarget: number;
    completedThisWeek: number;
}

interface Achievement {
    id: string;
    name: string;
    icon: string;
    unlockedDate: string;
}

interface ProgressDashboardProps {
    streak: number;
    achievements: Achievement[];
    meditationStats: MeditationStats;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
    streak,
    achievements,
    meditationStats,
}) => {
    const progressPercentage = (meditationStats.completedThisWeek / meditationStats.weeklyTarget) * 100;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="text-4xl font-bold text-white mb-2">Meditation Progress</h1>
                <p className="text-blue-100 text-lg">Track your mindfulness journey</p>
            </div>
            <div className="dashboard-grid">
                <div className="stat-card card-animate streak-card">
                    <div className="card-icon fire-icon">🔥</div>
                    <h3 className="card-title">Current Streak</h3>
                    <p className="stat-number">{streak}</p>
                    <p className="stat-label">days</p>
                    <div className="card-progress">
                        <div className="progress-bar streak-progress"></div>
                    </div>
                </div>
                <div className="stat-card card-animate meditation-card">
                    <div className="card-icon meditation-icon">🧘</div>
                    <h3 className="card-title">Total Meditations</h3>
                    <p className="stat-number">{meditationStats.totalMeditations}</p>
                    <p className="stat-label">sessions completed</p>
                    <div className="card-progress">
                        <div className="progress-bar meditation-progress"></div>
                    </div>
                </div>
                <div className="stat-card card-animate longest-card">
                    <div className="card-icon trophy-icon">🏆</div>
                    <h3 className="card-title">Longest Streak</h3>
                    <p className="stat-number">{meditationStats.longestStreak}</p>
                    <p className="stat-label">days record</p>
                    <div className="card-progress">
                        <div className="progress-bar longest-progress"></div>
                    </div>
                </div>
                <div className="stat-card card-animate duration-card">
                    <div className="card-icon clock-icon">⏱️</div>
                    <h3 className="card-title">Average Duration</h3>
                    <p className="stat-number">{meditationStats.averageDuration}</p>
                    <p className="stat-label">minutes per session</p>
                    <div className="card-progress">
                        <div className="progress-bar duration-progress"></div>
                    </div>
                </div>
                <div className="stat-card card-animate weekly-card col-span-full md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="card-title text-white">Weekly Target</h3>
                            <p className="text-gray-300 text-sm mt-1">
                                {meditationStats.completedThisWeek} of {meditationStats.weeklyTarget} sessions
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="stat-number text-3xl">{Math.round(progressPercentage)}%</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="weekly-progress h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="achievements-section card-animate">
                <h2 className="text-2xl font-bold text-white mb-6">🏅 Achievements Unlocked</h2>
                {achievements.length > 0 ? (
                    <div className="achievements-grid">
                        {achievements.map((achievement, index) => (
                            <div key={achievement.id} className="achievement-badge" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="achievement-icon">{achievement.icon}</div>
                                <p className="achievement-name">{achievement.name}</p>
                                <p className="achievement-date text-xs text-gray-400">
                                    {new Date(achievement.unlockedDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">Start meditating to unlock achievements!</p>
                )}
            </div>
            <div className="quote-section card-animate">
                <p className="quote-text"> "Every moment of mindfulness is a step towards inner peace" </p>
                <p className="quote-author">— Meditation Journey</p>
            </div>
        </div>
    );
};

export default ProgressDashboard;