import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const PostSkeleton = () => (
  <Card className="w-full">
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </Card>
);