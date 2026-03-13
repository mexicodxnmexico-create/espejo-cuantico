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
        // ⚡ BOLT OPTIMIZATION: Use a single O(n) loop to calculate both total and completed duration.
        // This reduces algorithmic complexity from O(2n) to O(n) and avoids redundant traversals.
        let totalDuration = 0;
        let completedDuration = 0;
        // ⚡ BOLT OPTIMIZATION: Get current time once to avoid redundant Date object creation in loop.
        const now = Date.now();

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
