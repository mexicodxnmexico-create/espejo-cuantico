import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';

// Mock CSS imports by overriding the require cache for .css files
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string) {
  if (id.endsWith('.css')) {
    return {};
  }
  return originalRequire.apply(this, arguments);
};

// Setup React for testing in Next.js environment
(global as any).React = React;

// Import *after* mocking CSS
const ProgressDashboard = require('../components/ProgressDashboard.tsx').default;

test('ProgressDashboard', async (t) => {
    const defaultProps = {
        streak: 5,
        achievements: [],
        meditationStats: {
            totalMeditations: 10,
            longestStreak: 7,
            averageDuration: 15,
            weeklyTarget: 5,
            completedThisWeek: 3
        }
    };

    await t.test('renders empty achievements correctly', () => {
        let root: TestRenderer.ReactTestRenderer | undefined;

        TestRenderer.act(() => {
            root = TestRenderer.create(<ProgressDashboard {...defaultProps} />);
        });

        const achievementsSection = root!.root.findByProps({ className: 'achievements-section card-animate' });

        let foundEmptyMessage = false;
        try {
            const p = achievementsSection.findByProps({ className: 'text-gray-400 text-center py-8' });
            if (p.children[0] === 'Start meditating to unlock achievements!') {
                foundEmptyMessage = true;
            }
        } catch (e) {
            // Not found
        }

        assert.ok(foundEmptyMessage, "Expected empty achievements message to be displayed");

        // Unmount safely
        TestRenderer.act(() => {
            root!.unmount();
        });
    });
});
