import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CssLibrarySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CSS Library</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="border-2 border-blue-500 border-collapse w-full">
          <thead>
            <tr>
              <th className="border border-amber-800 p-2 text-left break-words whitespace-normal">Class Name</th>
              <th className="border border-amber-800 p-2 text-left break-words whitespace-normal">Description</th>
              <th className="border border-amber-800 p-2 text-left break-words whitespace-normal">Used On</th>
              <th className="border border-amber-800 p-2 text-left break-words whitespace-normal">Preview</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-amber-800 p-2 break-words whitespace-normal">.trust-badge</td>
              <td className="border border-amber-800 p-2 break-words whitespace-normal">Rounded badge with blue background</td>
              <td className="border border-amber-800 p-2 break-words whitespace-normal">Footer, About page</td>
              <td className="border border-amber-800 p-2 break-words whitespace-normal"><div className="trust-badge">Preview</div></td>
            </tr>
            {/* Add more rows here */}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CssLibrarySection;