import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert';
import renderer from 'react-test-renderer';

// Necessary for TSX to work without explicitly importing React.createElement if Next.js handles it,
// but for our test runner we need React in scope globally.
(global as any).React = React;

import ProgressDashboard from '../components/ProgressDashboard';

test('ProgressDashboard test suite', async (t) => {
    const defaultStats = {
        totalMeditations: 10,
        longestStreak: 5,
        averageDuration: 15,
        weeklyTarget: 5,
        completedThisWeek: 3
    };

    await t.test('renders correctly with achievements', () => {
        const achievements = [
            { id: '1', name: 'First Step', icon: '🌱', unlockedDate: '2023-01-01T00:00:00Z' },
            { id: '2', name: 'Consistency', icon: '🔥', unlockedDate: '2023-01-05T00:00:00Z' }
        ];

        const component = renderer.create(
            <ProgressDashboard
                streak={3}
                achievements={achievements}
                meditationStats={defaultStats}
            />
        );

        const root = component.root;
        const badges = root.findAllByProps({ className: 'achievement-badge' });

        assert.strictEqual(badges.length, 2, 'Should render 2 achievements');

        // Ensure "Start meditating to unlock achievements!" is not rendered
        const emptyTexts = root.findAll(node =>
            node.type === 'p' &&
            typeof node.props.children === 'string' &&
            node.props.children.includes('Start meditating to unlock achievements!')
        );
        assert.strictEqual(emptyTexts.length, 0, 'Should not render empty state message');
    });

    await t.test('renders empty state correctly when no achievements', () => {
        const component = renderer.create(
            <ProgressDashboard
                streak={0}
                achievements={[]}
                meditationStats={defaultStats}
            />
        );

        const root = component.root;

        // Ensure no achievement badges are rendered
        const badges = root.findAllByProps({ className: 'achievement-badge' });
        assert.strictEqual(badges.length, 0, 'Should render 0 achievements');

        // Ensure the empty state message is rendered
        const emptyTexts = root.findAll(node =>
            node.type === 'p' &&
            typeof node.props.children === 'string' &&
            node.props.children.includes('Start meditating to unlock achievements!')
        );
        assert.strictEqual(emptyTexts.length, 1, 'Should render empty state message exactly once');
    });
});
