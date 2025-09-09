import { ProportionalWebTextBox } from './ProportionalWebTextBox';

const GpaJohnComments = () => {
  // Static banner - no comments rendered or stored locally
  return (
    <div className="mb-8">
      <ProportionalWebTextBox 
        webtextCode="SYS-LAA" 
        borderColor="#FF8C42"
        backgroundColor="bg-orange-100"
      />
    </div>
  );
};

export default GpaJohnComments;