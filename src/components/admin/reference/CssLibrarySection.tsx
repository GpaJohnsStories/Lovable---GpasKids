import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CssLibrarySection = () => {
  const cssClasses = [
    {
      name: ".trust-badge",
      description: "Rounded badge with blue background",
      usage: "Footer, About page",
      previewContent: "Trust Badge",
      category: "Custom CSS"
    },
    {
      name: ".nav-bubble",
      description: "Navigation tooltip with pointer arrow",
      usage: "Navigation menus",
      previewContent: "Tooltip",
      category: "Custom CSS"
    },
    {
      name: ".help-scroll-area",
      description: "Enhanced scrollbar styling",
      usage: "Help sections",
      previewContent: "Scroll Area",
      category: "Custom CSS"
    },
    {
      name: "bg-gradient-to-r from-orange-400 to-orange-600",
      description: "Orange gradient for headers and buttons",
      usage: "Main banner, buttons",
      previewContent: "Orange Gradient",
      category: "Brand Gradients"
    },
    {
      name: "shadow-lg hover:shadow-xl",
      description: "3D button effect with hover enhancement",
      usage: "Interactive buttons",
      previewContent: "3D Button",
      category: "Button Effects"
    },
    {
      name: "border-2 border-amber-300",
      description: "Thick amber border styling",
      usage: "Tables, containers",
      previewContent: "Amber Border",
      category: "Layout Utilities"
    },
    {
      name: "text-primary font-bold",
      description: "Primary brand text styling",
      usage: "Headings, emphasis",
      previewContent: "Primary Text",
      category: "Typography"
    }
  ];

  const renderPreview = (cssClass: any) => {
    if (cssClass.name === ".trust-badge") {
      return <div className="trust-badge">{cssClass.previewContent}</div>;
    }
    if (cssClass.name === ".nav-bubble") {
      return <div className="nav-bubble opacity-100 position-relative">{cssClass.previewContent}</div>;
    }
    if (cssClass.name === ".help-scroll-area") {
      return <div className="help-scroll-area h-8 overflow-y-auto border rounded p-1 text-xs">{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("bg-gradient")) {
      return <div className={`${cssClass.name.replace(/^\./, '')} p-2 rounded text-white text-center text-sm`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("shadow")) {
      return <div className={`${cssClass.name.replace(/^\./, '')} p-2 bg-blue-500 text-white rounded cursor-pointer text-sm text-center`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("border")) {
      return <div className={`${cssClass.name.replace(/^\./, '')} p-2 rounded text-center text-sm`}>{cssClass.previewContent}</div>;
    }
    if (cssClass.name.includes("text-primary")) {
      return <div className={`${cssClass.name.replace(/^\./, '')} text-center`}>{cssClass.previewContent}</div>;
    }
    return <div className="text-sm text-center p-1">{cssClass.previewContent}</div>;
  };

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
              <th className="border border-amber-800 p-2 text-left break-words whitespace-normal">Category</th>
              <th className="border border-amber-800 p-2 text-left break-words whitespace-normal">Preview</th>
            </tr>
          </thead>
          <tbody>
            {cssClasses.map((cssClass, index) => (
              <tr key={index}>
                <td className="border border-amber-800 p-2 break-words whitespace-normal font-mono text-sm">
                  {cssClass.name}
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal">
                  {cssClass.description}
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal">
                  {cssClass.usage}
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {cssClass.category}
                  </span>
                </td>
                <td className="border border-amber-800 p-2 break-words whitespace-normal">
                  {renderPreview(cssClass)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CssLibrarySection;