export interface ContainerProps {
  width: string;
  height: string;
  backgroundColor: string;
  borderStyle: string;
  borderWidth: string;
  borderColor: string;
}

export interface ContainerPropsChangeHandler {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
} 