import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Target, Trophy } from "lucide-react";
import ChallengeCard from "../components/challenges/ChallengeCard";

export default function Challenges() {
  const [showForm, setShowForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    category: "general",
    target_days: 7,
  });
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => base44.entities.EcoChallenge.list("-created_date", 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EcoChallenge.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      setShowForm(false);
      setNewChallenge({ title: "", description: "", category: "general", target_days: 7 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoChallenge.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
  });

  const activeChallenges = challenges.filter((c) => c.status === "active");
  const completedChallenges = challenges.filter((c) => c.status === "completed");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const suggestedChallenges = [
    { title: "Meatless Monday", description: "Skip meat every Monday for a week", category: "food", target_days: 4 },
    { title: "Bike to Work", description: "Cycle instead of driving for 5 days", category: "travel", target_days: 5 },
    { title: "Unplug Challenge", description: "Unplug all devices when not in use for 7 days", category: "electricity", target_days: 7 },
    { title: "Public Transit Week", description: "Use only public transit for all commutes", category: "travel", target_days: 5 },
    { title: "Vegan Week", description: "Eat fully plant-based for 7 consecutive days", category: "food", target_days: 7 },
    { title: "Energy Audit", description: "Reduce daily electricity use by 20% for a week", category: "electricity", target_days: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eco Challenges</h1>
          <p className="text-sm text-gray-500 mt-1">Build sustainable habits with challenges</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? "Cancel" : "New Challenge"}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold text-gray-800 mb-4">Create Custom Challenge</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Title</Label>
              <Input
                placeholder="Challenge name..."
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Description</Label>
              <Textarea
                placeholder="What's this challenge about?"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                className="rounded-xl mt-1 resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Category</Label>
                <Select value={newChallenge.category} onValueChange={(v) => setNewChallenge({ ...newChallenge, category: v })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Target Days</Label>
                <Input
                  type="number"
                  min="1"
                  value={newChallenge.target_days}
                  onChange={(e) => setNewChallenge({ ...newChallenge, target_days: parseInt(e.target.value) || 1 })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>
            <Button
              onClick={() => createMutation.mutate(newChallenge)}
              disabled={!newChallenge.title || createMutation.isPending}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              Start Challenge
            </Button>
          </div>
        </div>
      )}

      {/* Active Challenges */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald-600" />
          Active Challenges
          {activeChallenges.length > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {activeChallenges.length}
            </span>
          )}
        </h2>
        {activeChallenges.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-400 mb-1">No active challenges</p>
            <p className="text-xs text-gray-400">Start a challenge or pick one below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChallenges.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onUpdate={(id, data) => updateMutation.mutate({ id, data })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggested Challenges */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Suggested Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestedChallenges.map((s, i) => (
            <button
              key={i}
              onClick={() => createMutation.mutate({ ...s, status: "active", progress_days: 0 })}
              className="text-left p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
            >
              <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">{s.title}</p>
              <p className="text-xs text-gray-400 mt-1">{s.description}</p>
              <p className="text-xs text-emerald-600 font-medium mt-2">{s.target_days} days</p>
            </button>
          ))}
        </div>
      </div>

      {/* Completed */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            Completed
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {completedChallenges.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} onUpdate={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}