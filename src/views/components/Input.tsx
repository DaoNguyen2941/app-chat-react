interface InputProps {
  type: string;
  placeholder: string;
  field: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    value: string;
  };
}

const Input: React.FC<InputProps> = ({ type, placeholder, field }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...field}
      className="mt-2 p-2 w-full border border-gray-300 rounded-md"
    />
  );
};

export default Input;
