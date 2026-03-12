// Meditation Engine Logic

export interface Session {
    duration: number;
    startTime: Date;
    endTime: Date | null;
}

export class MeditationEngine {
    sessions: Session[];
    progress: number;

    constructor() {
        this.sessions = [];
        this.progress = 0;
    }

    startSession(duration: number): Session {
        const session: Session = {
            duration: duration,
            startTime: new Date(),
            endTime: null,
        };
        this.sessions.push(session);
        return session;
    }

    endSession(session: Session) {
        session.endTime = new Date();
        this.calculateProgress();
    }

    calculateProgress() {
        let totalDuration = 0;
        let completedDuration = 0;
        const now = Date.now();

        // ⚡ BOLT OPTIMIZATION: Use a single O(n) loop instead of multiple .reduce calls.
        // Also uses Date.now() to avoid redundant object creation during calculation.
        for (const session of this.sessions) {
            totalDuration += session.duration;
            const endTime = session.endTime ? session.endTime.getTime() : now;
            completedDuration += (endTime - session.startTime.getTime()) / 1000;
        }

        if (totalDuration === 0) {
            this.progress = 0;
            return;
        }

        this.progress = (completedDuration / totalDuration) * 100;
    }

    getProgress(): number {
        return this.progress;
    }
}
