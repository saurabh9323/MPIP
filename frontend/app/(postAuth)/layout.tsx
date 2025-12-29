import Sidebar from "@/src/layouts/Sidebar";
import Topbar from "@/src/layouts/Topbar";


export default function PostAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-muted p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
