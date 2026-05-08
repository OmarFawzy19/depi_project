import { useCallback } from "react";
import Loader from "../../components/common/Loader";
import Card from "../../components/ui/Card";
import { useFetch } from "../../hooks/useFetch";
import { propertyService } from "../../services/propertyService";
import { formatPrice } from "../../utils/helpers";

const PropertiesPage = () => {
  const fetcher = useCallback(() => propertyService.getProperties(), []);
  const { data, loading, error } = useFetch(fetcher);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data?.length) return <p className="text-slate-500">No properties available.</p>;

  return <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{data.map((property) => (
    <Card key={property.id}>
      <img src={property.image} alt={property.title} className="h-48 w-full object-cover" />
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-indigo-600">{formatPrice(property.price)}</p>
        <p className="text-sm text-slate-500">{property.location}</p>
        <p className="text-sm text-slate-600">{property.description}</p>
      </div>
    </Card>
  ))}</section>;
};

export default PropertiesPage;
