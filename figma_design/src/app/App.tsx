import { useState } from 'react';
import { Star, Trophy, Gift, Plus, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

type Activity = {
  id: string;
  title: string;
  description: string;
  tokens: number;
  completed: boolean;
};

type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
};

export default function App() {
  const [mode, setMode] = useState<'parent' | 'kid'>('kid');
  const [tokenBalance, setTokenBalance] = useState(45);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Clean your room',
      description: 'Make bed, organize toys, vacuum floor',
      tokens: 10,
      completed: false,
    },
    {
      id: '2',
      title: 'Homework time',
      description: 'Complete all homework assignments',
      tokens: 15,
      completed: false,
    },
    {
      id: '3',
      title: 'Help with dishes',
      description: 'Clear table and load dishwasher',
      tokens: 5,
      completed: true,
    },
    {
      id: '4',
      title: 'Read for 30 minutes',
      description: 'Read a book of your choice',
      tokens: 8,
      completed: false,
    },
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Extra Screen Time',
      description: '30 minutes of screen time',
      cost: 20,
      icon: '📱',
    },
    {
      id: '2',
      title: 'Ice Cream Trip',
      description: 'Go get ice cream together',
      cost: 30,
      icon: '🍦',
    },
    {
      id: '3',
      title: 'Movie Night',
      description: 'Pick the movie for family night',
      cost: 25,
      icon: '🎬',
    },
    {
      id: '4',
      title: 'Stay Up Late',
      description: '30 minutes past bedtime',
      cost: 15,
      icon: '🌙',
    },
    {
      id: '5',
      title: 'New Toy',
      description: 'Small toy from the store',
      cost: 50,
      icon: '🎁',
    },
  ]);

  const completeActivity = (id: string) => {
    const activity = activities.find((a) => a.id === id);
    if (!activity || activity.completed) return;

    setActivities(activities.map((a) =>
      a.id === id ? { ...a, completed: true } : a
    ));
    setTokenBalance(tokenBalance + activity.tokens);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff8b3d', '#ffd6a5', '#ffb88c'],
    });
  };

  const redeemReward = (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (!reward || tokenBalance < reward.cost) return;

    setTokenBalance(tokenBalance - reward.cost);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff8b3d', '#ffd6a5', '#ffb88c', '#ff6b35'],
    });

    alert(`🎉 You redeemed: ${reward.title}!`);
  };

  const activeActivities = activities.filter((a) => !a.completed);
  const completedActivities = activities.filter((a) => a.completed);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-8 h-8 text-primary" />
                Family Rewards
              </h1>
              <p className="text-muted-foreground mt-1">
                Complete activities, earn tokens, get rewards!
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 bg-card p-1 rounded-lg border border-border shadow-sm">
              <button
                onClick={() => setMode('kid')}
                className={`px-4 py-2 rounded-md transition-all ${
                  mode === 'kid'
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Kid View
              </button>
              <button
                onClick={() => setMode('parent')}
                className={`px-4 py-2 rounded-md transition-all ${
                  mode === 'parent'
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Parent View
              </button>
            </div>
          </div>

          {/* Token Balance */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="w-8 h-8" fill="currentColor" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Token Balance</p>
                  <p className="text-3xl font-bold">{tokenBalance}</p>
                </div>
              </div>
              <Trophy className="w-16 h-16 text-white/30" />
            </div>
          </div>
        </div>

        {/* Kid View */}
        {mode === 'kid' && (
          <div className="space-y-8">
            {/* Activities Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground">Activities to Complete</h2>
                <span className="text-sm text-muted-foreground">
                  {activeActivities.length} remaining
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {activeActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-card-foreground">{activity.title}</h3>
                      <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-primary" fill="currentColor" />
                        <span className="text-sm font-medium text-primary">{activity.tokens}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {activity.description}
                    </p>
                    <button
                      onClick={() => completeActivity(activity.id)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Mark Complete
                    </button>
                  </div>
                ))}
              </div>

              {completedActivities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-muted-foreground mb-3">Completed Today</h3>
                  <div className="space-y-2">
                    {completedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-muted border border-border rounded-lg p-4 flex items-center justify-between opacity-75"
                      >
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary" />
                          <span className="text-foreground">{activity.title}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Star className="w-4 h-4" fill="currentColor" />
                          <span className="text-sm">+{activity.tokens}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Rewards Store */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-primary" />
                <h2 className="text-foreground">Rewards Store</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-5xl mb-3 text-center">{reward.icon}</div>
                    <h3 className="text-card-foreground text-center mb-2">
                      {reward.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {reward.description}
                    </p>
                    <button
                      onClick={() => redeemReward(reward.id)}
                      disabled={tokenBalance < reward.cost}
                      className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        tokenBalance >= reward.cost
                          ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <Star className="w-4 h-4" fill="currentColor" />
                      <span>{reward.cost} tokens</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Parent View */}
        {mode === 'parent' && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground">Manage Activities</h2>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Activity
                </button>
              </div>

              <div className="grid gap-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {activity.completed && (
                          <div className="bg-primary/10 p-1 rounded">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <h3 className="text-card-foreground">{activity.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-secondary px-3 py-2 rounded-full">
                        <Star className="w-4 h-4 text-primary" fill="currentColor" />
                        <span className="text-sm font-medium text-primary">{activity.tokens}</span>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground px-2">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground">Manage Rewards</h2>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Reward
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4"
                  >
                    <div className="text-4xl">{reward.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-card-foreground mb-1">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {reward.description}
                      </p>
                      <div className="flex items-center gap-1 text-primary">
                        <Star className="w-4 h-4" fill="currentColor" />
                        <span className="text-sm font-medium">{reward.cost} tokens</span>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground px-2">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
