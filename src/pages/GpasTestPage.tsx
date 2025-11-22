import { SuperBox } from "@/components/admin/SuperBox";
import { superPrintO } from "../lib/superPrint-O";

/**
 * Gpa's Test Page
 *
 * Minimal test page for SuperBox component with no header or footer.
 * Used for testing SuperBox rendering with different story codes.
 */
const GpasTestPage = () => {
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <SuperBox code="WOR-FSK" />

      <button style={{ marginTop: "20px", padding: "10px 20px" }} onClick={() => superPrintO("WOR-FSK")}>
        Test Print WOR-FSK
      </button>
    </div>
  );
};

export default GpasTestPage;
