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

    // ⚡ BOLT OPTIMIZATION: Combine loops and remove new Date() inside the loop.
    // Replaced two separate O(n) reduce loops with a single O(n) loop to calculate both durations.
    // Replaced new Date().getTime() with Date.now() cached outside the loop to avoid object creation.
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
