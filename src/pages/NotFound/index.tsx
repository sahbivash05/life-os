import { Link } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <div>
      <PageHeader title="Not found" subtitle="That page doesn’t exist." />
      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-6">
          <div className="text-sm text-muted-foreground">
            The link may be broken or the page may have moved.
          </div>
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

