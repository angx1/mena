export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams.id) {
    return <div>Error: Trip id not found</div>;
  }

  return <div>Trip id: {resolvedParams.id}</div>;
}
