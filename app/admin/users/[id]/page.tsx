export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>User Detail: {params.id}</h1>
    </main>
  );
}
