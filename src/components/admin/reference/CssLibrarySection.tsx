import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CssLibrarySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CSS Library</CardTitle>
      </CardHeader>
      <CardContent>
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Description</th>
              <th>Used On</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>.trust-badge</td>
              <td>Rounded badge with blue background</td>
              <td>Footer, About page</td>
              <td><div className="trust-badge">Preview</div></td>
            </tr>
            {/* Add more rows here */}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CssLibrarySection;