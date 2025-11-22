export function PoliteProxyLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
}

