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
        const totalDuration = this.sessions.reduce((acc, session) => acc + session.duration, 0);

        if (totalDuration === 0) {
            this.progress = 0;
            return;
        }

        const completedDuration = this.sessions.reduce((acc, session) => {
            const endTime = session.endTime ? session.endTime.getTime() : new Date().getTime();
            return acc + (endTime - session.startTime.getTime()) / 1000;
        }, 0);
        this.progress = (completedDuration / totalDuration) * 100;
    }

    getProgress() {
        return this.progress;
    }
}
