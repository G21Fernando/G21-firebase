import mixpanel from 'mixpanel-browser';

// Initialize mixpanel
mixpanel.init('YOUR_MIXPANEL_TOKEN', {
  debug: import.meta.env.DEV,
  track_pageview: true,
  persistence: 'localStorage',
});

// Analytics events
export const Analytics = {
  trackChordSprintStart: (userId: string) => {
    mixpanel.track('Chord Sprint Started', {
      distinct_id: userId,
      timestamp: new Date(),
    });
  },

  trackChordSprintComplete: (userId: string, chordPair: string, reps: number) => {
    mixpanel.track('Chord Sprint Completed', {
      distinct_id: userId,
      chord_pair: chordPair,
      reps,
      timestamp: new Date(),
    });
  },

  trackPracticeTime: (userId: string, seconds: number) => {
    mixpanel.track('Practice Time', {
      distinct_id: userId,
      seconds,
      timestamp: new Date(),
    });
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  },
};