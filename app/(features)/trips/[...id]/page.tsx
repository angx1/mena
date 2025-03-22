export default async function TripPage({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: any }>;
}) {
  const params = await paramsPromise;
  if (!params) {
    return <div>Error: Trip id not found</div>;
  }
  return <div>Trip id: {params.id}</div>;
}
