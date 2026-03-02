import { performance } from 'perf_hooks';

// Setup Mock MeditationEngine
class MeditationEngine {
    sessions: any[] = [];
    progress: number = 0;

    startSession(duration: number) {
        const session = {
            duration: duration,
            startTime: new Date(Date.now() - duration * 1000), // simulated past
            endTime: new Date(),
        };
        this.sessions.push(session);
        return session;
    }

    // ORIGINAL METHOD
    calculateProgressOriginal() {
        const totalDuration = this.sessions.reduce((acc, session) => acc + session.duration, 0);
        const completedDuration = this.sessions.reduce((acc, session) => {
            const endTime = session.endTime ? session.endTime.getTime() : new Date().getTime();
            return acc + (endTime - session.startTime.getTime()) / 1000;
        }, 0);
        this.progress = (completedDuration / totalDuration) * 100;
    }

    // NEW METHOD
    calculateProgressOptimized() {
        let totalDuration = 0;
        let completedDuration = 0;
        const now = new Date().getTime();

        for (let i = 0; i < this.sessions.length; i++) {
            const session = this.sessions[i];
            totalDuration += session.duration;
            const endTime = session.endTime ? session.endTime.getTime() : now;
            completedDuration += (endTime - session.startTime.getTime()) / 1000;
        }

        this.progress = (completedDuration / totalDuration) * 100;
    }
}

const engine = new MeditationEngine();
for (let i = 0; i < 100000; i++) {
    engine.startSession(600);
}

// Warmup
for (let i = 0; i < 100; i++) {
    engine.calculateProgressOriginal();
    engine.calculateProgressOptimized();
}

// Measure Original
const startOriginal = performance.now();
for (let i = 0; i < 1000; i++) {
    engine.calculateProgressOriginal();
}
const endOriginal = performance.now();

// Measure Optimized
const startOptimized = performance.now();
for (let i = 0; i < 1000; i++) {
    engine.calculateProgressOptimized();
}
const endOptimized = performance.now();

console.log(`Original: ${(endOriginal - startOriginal).toFixed(2)}ms`);
console.log(`Optimized: ${(endOptimized - startOptimized).toFixed(2)}ms`);
console.log(`Improvement: ${(((endOriginal - startOriginal) - (endOptimized - startOptimized)) / (endOriginal - startOriginal) * 100).toFixed(2)}%`);

// MEASURE Optimized 2 (for...of)
MeditationEngine.prototype.calculateProgressOptimized2 = function() {
    let totalDuration = 0;
    let completedDuration = 0;
    const now = new Date().getTime();

    for (const session of this.sessions) {
        totalDuration += session.duration;
        const endTime = session.endTime ? session.endTime.getTime() : now;
        completedDuration += (endTime - session.startTime.getTime()) / 1000;
    }

    this.progress = (completedDuration / totalDuration) * 100;
}

const startOptimized2 = performance.now();
for (let i = 0; i < 1000; i++) {
    (engine as any).calculateProgressOptimized2();
}
const endOptimized2 = performance.now();
console.log(`Optimized (for...of): ${(endOptimized2 - startOptimized2).toFixed(2)}ms`);


// MEASURE Optimized 3 (reduce single pass)
MeditationEngine.prototype.calculateProgressOptimized3 = function() {
    const now = new Date().getTime();
    const result = this.sessions.reduce(
        (acc, session) => {
            const endTime = session.endTime ? session.endTime.getTime() : now;
            acc.totalDuration += session.duration;
            acc.completedDuration += (endTime - session.startTime.getTime()) / 1000;
            return acc;
        },
        { totalDuration: 0, completedDuration: 0 }
    );
    this.progress = (result.completedDuration / result.totalDuration) * 100;
}

const startOptimized3 = performance.now();
for (let i = 0; i < 1000; i++) {
    (engine as any).calculateProgressOptimized3();
}
const endOptimized3 = performance.now();
console.log(`Optimized (reduce single pass): ${(endOptimized3 - startOptimized3).toFixed(2)}ms`);
