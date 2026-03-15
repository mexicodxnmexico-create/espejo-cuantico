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

        for (const session of this.sessions) {
            totalDuration += session.duration;
            const endTime = session.endTime ? session.endTime.getTime() : now;
            completedDuration += (endTime - session.startTime.getTime()) / 1000;
        }

        // ⚡ BOLT OPTIMIZATION: Avoid division by zero and handle O(n) calculation in a single pass.
        this.progress = totalDuration === 0 ? 0 : (completedDuration / totalDuration) * 100;
    }

    getProgress(): number {
        return this.progress;
    }
}
