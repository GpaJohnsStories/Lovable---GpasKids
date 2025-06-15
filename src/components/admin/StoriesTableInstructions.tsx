
const StoriesTableInstructions = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div style={{ 
        color: 'black', 
        fontSize: '12px', 
        fontStyle: 'italic', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.4'
      }}>
        <p style={{ marginBottom: '12px' }}>
          Click on any column heading to sort the library by that column. The first click will always sort down and the next click will sort up.
        </p>
        <p>
          As more stories are loaded, you may want to keep a note on your device or even use pencil and paper to record the Story Code so you can find it easily in the future.
        </p>
      </div>
    </div>
  );
};

export default StoriesTableInstructions;
