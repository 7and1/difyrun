import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="container py-8 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
