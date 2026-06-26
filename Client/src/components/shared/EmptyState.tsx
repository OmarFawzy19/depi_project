const EmptyState = ({ message = "No results found" }) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <p className="text-lg">{message}</p>
  </div>
);
export default EmptyState;