const PureTable = () => {
  return (
    <table>
      <tbody>
        <tr style={{ height: '27.5px' }}>
          <td style={{ backgroundColor: '#2563eb' }}></td>
          <td style={{ backgroundColor: '#2563eb' }}></td>
          <td style={{ backgroundColor: '#2563eb' }}></td>
          <td style={{ backgroundColor: '#2563eb' }}></td>
        </tr>
        <tr style={{ height: '55px' }}>
          <td style={{ backgroundColor: '#2563eb' }}></td>
          <td style={{ backgroundColor: '#2563eb' }}></td>
          <td style={{ backgroundColor: '#2563eb' }}></td>
          <td style={{ backgroundColor: '#2563eb' }}></td>
        </tr>
        <tr style={{ height: '27.5px' }}>
          <td colSpan={4} style={{ backgroundColor: 'transparent', border: 'none' }}></td>
        </tr>
        <tr style={{ height: '27.5px' }}>
          <td colSpan={4} style={{ backgroundColor: '#8B4513' }}></td>
        </tr>
        <tr style={{ height: '55px' }}>
          <td colSpan={4} style={{ backgroundColor: '#8B4513' }}></td>
        </tr>
      </tbody>
    </table>
  );
};

export default PureTable;