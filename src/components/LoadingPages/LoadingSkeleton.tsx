import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6 bg-background">
      <style jsx>{`
        @keyframes ekg {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        .animate-ekg {
          animation: ekg 2s ease-in-out infinite;
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-medical {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10%); }
        }
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <div className="border-b-2 border-primary">
          <Skeleton className="h-10 w-24 rounded-t-lg animate-shimmer" />
        </div>
        <Skeleton className="h-10 w-24 rounded-t-lg animate-shimmer" />
      </div>

      {/* Search bar */}
      <div className="relative">
        <Skeleton className="h-10 w-full rounded-full animate-shimmer" />
        <div className="absolute right-3 top-2">
          <Skeleton className="h-6 w-6 rounded-full animate-bounce-slow" />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left panel */}
        <div className="border rounded-lg p-6 space-y-6 bg-card shadow-md">
          <h2 className="text-xl font-bold text-card-foreground">Patient Details</h2>
          
          {/* Patient Details content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/4 animate-pulse-medical" />
                <Skeleton className="h-5 w-1/4 animate-pulse-medical" />
                <Skeleton className="h-5 w-1/4 animate-pulse-medical" />
              </div>
              <Skeleton className="h-4 w-full animate-pulse-medical" />
              <Skeleton className="h-4 w-3/4 animate-pulse-medical" />
            </div>

            {/* Sections with EKG-like animation */}
            {['Current Medications', 'Patient Risk Factors', 'Lab Reports', 'Diagnostic Tests and Results', 'Profile Summary'].map((section, index) => (
              <div key={section} className="space-y-2">
                <div className="h-4 w-full bg-muted rounded-md overflow-hidden">
                  <div className="h-full w-full animate-ekg origin-left"></div>
                </div>
                <Skeleton className="h-4 w-full animate-shimmer" />
                <Skeleton className="h-4 w-3/4 animate-shimmer" />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Medical Condition */}
          <div className="border rounded-lg p-6 bg-card shadow-md">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Medical Condition</h2>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-md overflow-hidden">
                <div className="h-full w-full animate-ekg origin-left"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-full animate-shimmer" />
                ))}
              </div>
            </div>
          </div>

          {/* Final Recommendation */}
          <div className="border rounded-lg p-6 bg-card shadow-md">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Final Recommendation</h2>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-md overflow-hidden">
                <div className="h-full w-full animate-ekg origin-left"></div>
              </div>
              <Skeleton className="h-4 w-full animate-shimmer" />
              <Skeleton className="h-4 w-full animate-shimmer" />
              <Skeleton className="h-4 w-3/4 animate-shimmer" />
            </div>
          </div>

          {/* Retrieved Docs */}
          <div className="border rounded-lg p-6 bg-card shadow-md">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Retrieved Docs</h2>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-md overflow-hidden">
                <div className="h-full w-full animate-ekg origin-left"></div>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-2/3 animate-shimmer" />
                  <Skeleton className="h-4 w-16 animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}