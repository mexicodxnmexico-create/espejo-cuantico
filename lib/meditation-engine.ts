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

        let totalDuration = 0;
        let completedDuration = 0;
        // ⚡ BOLT OPTIMIZATION: Hoist Date.now() out of the loop to prevent O(n) object allocation
        const now = Date.now();

        // ⚡ BOLT OPTIMIZATION: Combine two reduce loops into one O(n) for loop
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
