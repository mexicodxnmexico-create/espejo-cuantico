// Meditation Engine Logic

class MeditationEngine {
    constructor() {
        this.sessions = [];
        this.progress = 0;
    }

    startSession(duration) {
        const session = {
            duration: duration,
            startTime: new Date(),
            endTime: null,
        };
        this.sessions.push(session);
        return session;
    }

    endSession(session) {
        session.endTime = new Date();
        this.calculateProgress();
    }

    calculateProgress() {
        let totalDuration = 0;
        let completedDuration = 0;
        const now = Date.now();

        for (let i = 0; i < this.sessions.length; i++) {
            const session = this.sessions[i];
            totalDuration += session.duration;
            const endTime = session.endTime ? session.endTime.getTime() : now;
            completedDuration += (endTime - session.startTime.getTime()) / 1000;
        }

        this.progress = totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;
    }

    getProgress() {
        return this.progress;
    }
}

// Example usage
const engine = new MeditationEngine();
const session1 = engine.startSession(600); // 10 minutes
setTimeout(() => {
    engine.endSession(session1);
    console.log(`Session progress: ${engine.getProgress()}%`);
}, 10000); // Ends session after 10 seconds
