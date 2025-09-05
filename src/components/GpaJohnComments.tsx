import { ProportionalWebTextBox } from './ProportionalWebTextBox';

const GpaJohnComments = () => {
  // Static banner - no comments rendered or stored locally
  return (
    <div className="mb-8">
      <ProportionalWebTextBox 
        webtextCode="SYS-LAA" 
        borderColor="#2563eb"
        backgroundColor="bg-blue-50"
      />
    </div>
  );
};

export default GpaJohnComments;