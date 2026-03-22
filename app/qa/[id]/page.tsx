export default function QADetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Q&A #{params.id}</h1>
    </main>
  );
}
