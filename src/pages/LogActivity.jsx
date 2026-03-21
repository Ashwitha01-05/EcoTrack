import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import ActivityForm from "../components/log/ActivityForm";

export default function LogActivity() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={createPageUrl("Dashboard")}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Log Activity</h1>
            <p className="text-sm text-gray-500">Track your daily carbon footprint</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <ActivityForm
          onSubmit={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}