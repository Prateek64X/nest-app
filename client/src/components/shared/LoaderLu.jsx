import { ClipLoader } from "react-spinners";

export default function LoaderLu({ size = 35 }) {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <ClipLoader size={size} color="#ff2056" />
    </div>
  );
}
