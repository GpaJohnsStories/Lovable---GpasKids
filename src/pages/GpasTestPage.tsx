import SimpleBanner from "@/components/SimpleBanner";
import LoadingSpinner from "@/components/LoadingSpinner";
import PureTable from "@/components/PureTable";

const GpasTestPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SimpleBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-heading-system text-center mb-8">Gpa's Test Page</h1>
        <PureTable />
      </div>
    </div>
  );
};

export default GpasTestPage;
