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
        if (this.sessions.length === 0) {
            this.progress = 0;
            return;
        }

        // ⚡ BOLT OPTIMIZATION: Combine totalDuration and completedDuration calculations into a single O(n) loop.
        // Prevents two separate array traversals. Pre-calculate Date.now() to avoid redundant object instantiation.
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
