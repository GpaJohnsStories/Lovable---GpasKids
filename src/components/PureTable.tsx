const PureTable = () => {
  return (
    <table>
      <tbody>
        <tr className="h-27-5">
          <td className="bg-blue-500-hex"></td>
          <td className="bg-blue-500-hex"></td>
          <td className="bg-blue-500-hex"></td>
          <td className="bg-blue-500-hex"></td>
        </tr>
        <tr className="h-55">
          <td className="bg-blue-500-hex"></td>
          <td className="bg-blue-500-hex"></td>
          <td className="bg-blue-500-hex"></td>
          <td className="bg-blue-500-hex"></td>
        </tr>
        <tr className="h-27-5">
          <td colSpan={4} className="bg-transparent-none"></td>
        </tr>
        <tr className="h-27-5">
          <td colSpan={4} className="bg-brown-hex"></td>
        </tr>
        <tr className="h-55">
          <td colSpan={4} className="bg-brown-hex"></td>
        </tr>
      </tbody>
    </table>
  );
};

export default PureTable;