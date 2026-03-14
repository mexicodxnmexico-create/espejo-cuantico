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
        // ⚡ BOLT OPTIMIZATION: Combine total and completed duration calculations into a single loop.
        // Changes algorithmic complexity from O(2n) to O(n) and avoids duplicate array traversals.
        let totalDuration = 0;
        let completedDuration = 0;

        // ⚡ BOLT OPTIMIZATION: Cache current time outside the loop and use Date.now() instead of new Date().getTime()
        // Prevents unnecessary object allocation and garbage collection overhead on every iteration.
        const now = Date.now();

        for (let i = 0; i < this.sessions.length; i++) {
            const session = this.sessions[i];
            totalDuration += session.duration;
            const endTimeMs = session.endTime ? session.endTime.getTime() : now;
            completedDuration += (endTimeMs - session.startTime.getTime()) / 1000;
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
