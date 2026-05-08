const Card = ({ children }: { children: React.ReactNode }) => (
  <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{children}</article>
);

export default Card;
