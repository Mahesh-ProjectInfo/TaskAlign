import { Outlet } from "react-router-dom";
import image from "../../assets/log.png";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <img
        src={image}
        alt="Task Align"
        className="absolute inset-0 h-full w-full object-fill"
      />

      {/* Login Form */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-start">
        <div className="ml-[8%] w-full max-w-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}