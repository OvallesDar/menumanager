"use client";
import { useContext } from "react";
import { SectionsContext } from "@/app/context/section-context";
import Loading from "@/components/loading";
import CardDashboard from "@/components/card-dashboard";

export default function Page() {
  const { sections, categories, products, loading, error } =
    useContext(SectionsContext);

  if (loading) return <Loading />;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CardDashboard
          items={sections}
          title={"secciones"}
          basepath={"sections"}
        />
        <CardDashboard
          items={categories}
          title={"categorías"}
          basepath={"categories"}
        />
        <CardDashboard
          items={products}
          title={"productos"}
          basepath={"products"}
        />
      </div>
    </div>
  );
}
