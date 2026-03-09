/**
 * Meditation Engine for tracking mindfulness session progress.
 */

export interface Session {
  duration: number; // in seconds
  startTime: number; // timestamp
  endTime: number | null; // timestamp or null
}

export class MeditationEngine {
  private sessions: Session[] = [];
  private progress: number = 0;

  /**
   * Starts a new meditation session.
   * @param duration Target duration in seconds.
   */
  startSession(duration: number): Session {
    const session: Session = {
      duration,
      startTime: Date.now(),
      endTime: null,
    };
    this.sessions.push(session);
    return session;
  }

  /**
   * Ends a meditation session and recalculates progress.
   * @param session The session to end.
   */
  endSession(session: Session): void {
    session.endTime = Date.now();
    this.calculateProgress();
  }

  /**
   * Calculates overall progress across all sessions.
   * Reduces algorithmic complexity from O(2n) to O(n) by using a single loop.
   */
  calculateProgress(): void {
    let totalDuration = 0;
    let completedDuration = 0;
    const now = Date.now();

    // ⚡ BOLT OPTIMIZATION: Single-pass O(n) calculation to avoid multiple array traversals.
    // Also uses Date.now() instead of new Date() to minimize object instantiation.
    for (const session of this.sessions) {
      totalDuration += session.duration;
      const endTime = session.endTime ?? now;
      completedDuration += (endTime - session.startTime) / 1000;
    }

    // ⚡ BOLT OPTIMIZATION: Safety check for zero total duration to prevent NaN results.
    if (totalDuration <= 0) {
      this.progress = 0;
    } else {
      this.progress = (completedDuration / totalDuration) * 100;
    }
  }

  /**
   * Returns current progress as a percentage (0-100).
   */
  getProgress(): number {
    return this.progress;
  }
}
